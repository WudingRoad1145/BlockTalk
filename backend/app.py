from revChatGPT.V1 import Chatbot
import datetime
from flask_cors import CORS
from flask import Flask, request
import ssl

prompt_template = """BlockTalk allows user to send complex on-chain transactions using natural language commands. 

Natural language input from user will be translated into (a list of) one of following 3 types of commands by BlockTalk:

1. `SEND [number or percentage] [token_name] TO [wallet_address] ON [chain]`
explanation: Send a certain number or percentage of one token to another address on a chain.
example command: `SEND 122.3 USDC TO 0xD00BA44b6d6e6f37DCdA75df508057b76b533842 on Ethereum`
2. `SWAP [number or percentage] [token_name] TO [token_name] ON [chain]`
explanation: Swap a certain number or percentage of one token to another token on a chain.
example command: `SWAP 50% ETH TO DAI on Goerli`
3. `BRIDGE [number or percentage] [token_name] FROM [chain] TO [chain]`
explanation: Bridge a certain number or percentage of one token on one chain to another chain.
example command: `BRIDGE 67.4% ETH FROM Ethereum TO Goerli`

Other relevant information will be given in the following format:

User wallet address: 0xc0ffee254729296a45a3885639AC7E10F9d54979
User asset by chain:
* Ethereum: 0.1 ETH
* Polygon: 2.234 MATIC, 4.5 USDC
* Arbitrum: 4.5 USDT
Asset price for all chains:
* 1 ETH = 1890 USD
* 1 MATIC = 1.25 USD
* 1 DAI = 1 USDC = 1 USDT = 1 USD

All transactions must be done from user's wallet address. 

You are BlockTalk right now and all you can output are (lists of) steps that strictly follow the step format above. Minimize the number of steps when achieve a goal. Say Nothing other than (list of) commands. 

User asset by chain:
* Ethereum: 0.93 ETH, 90.2 USDT
* Polygon: 2.234 MATIC, 45 USDC, 2 DAI
* Arbitrum: 345 USDT, 9 UNI
Asset price for all chains:
* 1 ETH = 1634 USD
* 1 MATIC = 3.45 USD
* 1 UNI = 6.7 USD
* 1 DAI = 1 USDC = 1 USDT = 1 USD

[user]: {user_input}"""

ssl._create_default_https_context = ssl._create_unverified_context
chatbot = Chatbot(config={
    "session_token": "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..0p3bPLBBsxuEl-GC.IURPE-iP5hHxNsH-mAIHiyvuQr1Fj5qDCPgjzTazWyEdSidwgo1avYqo8O2SaAvSoPTNHt_39zZVI2I-FE32oDXMyszMxM49BTGZAB608qdCy1h3DZCGpiZZ-H1D-5lN_ILGFy92Z49UeJMkWW0JGI1rO6oRACy1t7n6Ny3yc5ioNsWhAAgLTcvcORFb--k2BMFuFVAGP9HENdaSAuY9X83oELFLkOvOSVy_K3uCcMoHeHVZ8_j5-3paLPA2TRgye3Hr3MT0wZ5PytHGo1vHC-qWws4fgRRybYyau6iqyJDVLtWroyHOwodF5SAC-alHPLuMZ0RssdDH2HCMcRLREE5c2JUvSTYLY32Wfa-7oNI26ugG2kYJwdgxpVOG_xaq59cnDhALN6pGR3JeOOgnJdWzjMl7Xr8rVi1v5GlVFeFmHddHWRNW8Pk1nHRoTpbTO-i5D_b8tJZRXZqy6mHRTtY3WO8JK79O970tgJkhKBnaM84J2NnXRUKpWf-hh-WOw0_w7XLWThZ_IhP2-YYchv9gumVnJ-3Ol7lQkANUzerYF9T6UB4TVtA_3iDbmet4cGSY-Zwr5cYZHabyF9tpfki1MbAtTvbMRy9XK8lEgTfNJvJwlxW_8I79GRpBdDOGCvxNeaTYLdtgKe4MyBiUQL_oKfbKRGAf4xf2l37X_UpID9m_mF7MO7cOrCqQX9uPMspPV5Ewc-40ch9doOi74yi0THIgP6jnQtx7Nc2ltFg828mzYRZdo_ns5x8ozE0B0mr8YYoBYkfLFL-ogWkRc07YscGzhVsq2KDFwu1r-7tB98uSyLepbq2TuHMHYUk4a1Gwcq8FGIYmkxwIKxVtEGrp-PYsR4ArolnNBGl-c-EF6zPbfAA9E5i5tON-CmIu8A7XBu3G9-BMNnufaPltbrsf7dBYPKTslG8cztYC_IRzrqw_VlejBYyQpqrPsMNnqLUDiF5IAd15TEeKQiLuk4pD706be24j98-ejwvUAi6MOMvtEi3VpX-YkoRDqcUk_xS_diOA8sgosDgjZ-n_79g59VbVzvnHK8_8kqpyJego7e-dPsfxTu0rbrdWF401U21a2unkkhyBU2jrkvheGTE5z2hPnOwPWqSQujg4OQ_pB-HIaeB-dVCPtW5ao08tK8vdGXx8lpRZt6msTMyS5uP3XzieXowI8zbFD0_WCsyjeL4_abGGloV7a1XzQ45bhfEmcdoQs8FAnii8FkWMl6KX_4vh4_XQjh2E9P4Rxl6RLU6RdqdTbutlJZs9JDA3VsB-vbdPBZ6-RaQ2HXyEYIPR1RMd61wxGqM60yF1U7cyyzQOz2Cspfao1ySHEU0eQCt4IYgge0z5FgHA1QYvmEXcz4eh_p5LwTYWpFt9aPm7IlnEcrBaOMaQ-RjTb1WMkO9Rw4CwLdUYK_xv-vGGF8U6Bic6fSec5oQ_46Rjgf3MPP2yuPd1Gt4QihhCTfHY2gpsOk8wS9pKEkBOyrEMiGwlQ4l-KJ5E1XWIb-cr1TomlDjT-4zDnpuKVGeEctUqPT3eocZfaLdO-xh2VUBjW0TbON7ELYF3yNU_8MsR1aalHhSiTnCm-PYKS-8VVDLMUWIg09sG9wSed3RuhtkYDPp6qMhjLr7af9Nco5WNpaVbLtDh3-7hN6Kidu79UjJYS1OdhCCTYDQYSD8Ai5fJ7KG_j_bHgnIt_uuViTh3z4V7AJjSicgxZiUy4VHFqdl02mRXGLuGCHlewMMzJ6sNC5LzPhdSu3hsQQl5pK9CiQUG9tq13VKC7f6Ro5p_cc7kADPnirgPGzCs9XkVtTbwkDsC0GhPCmsNQ79pdo831Xk6QqjY2v9Znfv7xwEmmIJTFIvhXhF8xgooyCdL0Agzk3VjAAZ16RtB5xRqSvKf9KE0O9KiCbDsqu5f95WIBh1BMlcBU4gpOrlpe8HXrwzBsnCI_c1eWUP9galfOlthiufDuMKu7TQW5TH2FIO9AiNJ-tvcPVCsWZfrHBIyESfhDDE7oFDzzR5YyqEhyKVaYLXNYeGwSG_ubk0-_EFPInG7kWfkhmickiG14AGvk8CG8wfqnEq4sxoh-3-5tdxKqCkILxYYawjfEOjj1VjoNDqlK4o1-AOxYQH_kV_ZFD6CPrJT8MhhgI784sTiuDk5vgZnfx_fzDr_zWJYuKef8vqdnPjnQHWQ3xP1DmQfoZ2iiZPcGnMyfvABBUPvVQ8naWAMdZjW8aWY1Tsod1YpX38tyPxBskLq9jit-yHwn6yxYpbpZEkokpTX_MhyaRa1Sf7os9gfabII-dNUJSpQJitpbaoGHPmbH-q-aq1xnfI_GaORf5ayy_NmUu9dUrvMChNwULRxPtHRVHdJMQFOQCIp4USH_mE3N1Yiw2RNylqBELwheLk8N7Y2vQNhcwRW6xSgWO_FG0GO1EENeidJTMzk8UnCN2Z0-TGH5hRFZriIWKaS7bA0VmwtFdDbbSr2nxg4AHZmYR_31gbJ4FO2VV7VKeVwcrwIQRA7I1E.c2dznE_FhTzmysWnKxKZSA"
})  # You can start a custom conversation

response = ""
for data in chatbot.ask(
  prompt_template.replace("{user_input}", "I wanna send all of my USDC on Goerli to 0x986854779804799C1d68867F5E03e601E781e41b")
):
    response = data["message"]
    
# Initializing flask app
app = Flask(__name__)
CORS(app)


# Route for seeing chatgpt output
@app.route('/chatgpt', methods=['POST'])
def get_time():
    if request.method == 'POST':
        chatgpt_input = request.get_json()['input']

        print(chatgpt_input)
        
        response = ""
        for data in chatbot.ask(
            "[user]: " + chatgpt_input
        ):
            response = data['message']
    # Returning an api for showing in  reactjs
    return {
        'output': response
    }


# Route for seeing info
@app.route('/info')
def data():
    return {
        "Project Name": "BlockTalk"
    }


# Running app
if __name__ == '__main__':
    app.run(debug=True, port=5000)
