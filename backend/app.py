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
example command: `SWAP 50% ETH TO DAI on Polygon`
3. `BRIDGE [number or percentage] [token_name] FROM [chain] TO [chain]`
explanation: Bridge a certain number or percentage of one token on one chain to another chain.
example command: `BRIDGE 67.4% ETH FROM Ethereum TO Polygon`

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
    "session_token": "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..m6YDvHKnjPYgE4sw.6l_1zfgmWmFFS_loHfrwSDC6r9HVfFXYb-5eUDoX8cE4Q6nALQxgWDFmpi0HSVcDPmDKYefqNcOOpdgcpgotwvfrm2uPV7y2TW2Ca2BveEYgk1ijeV8GAMFfjHf8JSS73HT9bQXBWQnyrEXSHKyaD1qZebv4z7yniAWHWwpCRFLoGbz-gztp4FJp4DQAtzfLDg_QY2qk7Z6q0eXXK2ExSnq6Z-WI8ZdB_K53auqsH2woEkDAolWB29oHtRIXKmK3RcObpPwav8gLI3gZIt7psstIwxCqN84Bi6xauSxeTeysTDTB7lqc4P-RtiV7kbG2ExwtcKUstra8M056OiCgEgMC9rM6jJlwNZ8u5yZjI3o86SHebZPWaBZP5ddGQUbhx2CoOsi2ZGyuKV3Fyknw6hcPa6OkiB_rN_8-jxF0fz8m2-8jdTkxrmKLblLw12UTxg8RJyUDdiBTNS3FdS_04v1A64fpAtAQ3XfdqkpukVOiRFEAe6L82vQVn1k4rA848EtKxxvv6xF5WdjKxN-SnU_GA8D1wptvOAr3fJaZPqdz6ajSqexHCrC8Lqy0utPP34ZjEXoPDRA1xKy8R8bhO7b_bRXoTSR8dFJ1QG6GSQTnFTF6TXAtL62vtf3egH6NgDUHWXmL7r5ziwb4GIHevZ8-lZ05mMDwnGsy8K_RcvVCU9NEkMan3NVUUsCZvIodMsVRrG5OLevIILutJ3Kji2buzq54QKRVComia72p8vYr8LYwoa3POFkiVvRPBDFrTY6A1TaMsA-2mjOAKgIllgN98zit4ThOjXqwU3mzJqFocSxiLR68HE27VLd38kr5UfQOUMMX7L61gjYCcYlO2ToahaYV99Mzt7J_JVfW_TwrkRDp-c_bH_lkhifCk3t8aAgBsa-wqWr4SBt1iRDfc0zuAwM11iDe0gDpJ3X5zz06i0PMZ8xtcZVZ8vg63U2xM75YcxVvObOLmE0OBPgJRNlReO6d9MpIQdqpDAGx_RxdpSYP3mIo9jHWFHH_u9UhXfGmctwN85O_ecbccJRGlnIuKbdqFz3onMO8GBiGBL84mcmoBZucdtm5Z8Jz-FWwColyeWtP29GiE_558jg3TGNj748rGHSWQErt75Gq_UvsZpIKY4Y9pCjn_eTJoXOHREIwvuwKWmfELm0Wj5xEjCLdi-X8S6PcgAIdXXMzBca38FXec-Uh0OAn7N-sk7Q4_DaBVx4Mv8lwP9MPQ_T7qxCOV7PUNz5WHEJnpdEv_-MDksW1U93rrdl7DKa_LdLDVLkx2a0K4_EVGt9ZG0U7cChad5roerDAp8EkYqTugGcydVZUsgv2yTHH7jvDMTZsTQgSrf7T3iSSsSDfkcBhUZtTRRr8gmA7DwehdQhKzwIDTWfe6XqLG_f2Mu1vp9B5-kQ_NR0O0Hv3UMiWSM1WZQB25pqvO3L5-4X8LScn9E0VV-PtHZBscHMUNS5jqT_2eyPIwcTK1ZuELxYSj3L1DPINqfXiVXRkwvndbtXLoHH1wcoWyGdqbMgJJsaEbmE3Nn42_ahWomaayV3-jtT_4nbCzQxzx5uLadHz3e0897VKkcUXhnoHGDn_ZBJ4XfmEMHjD--b8Vytyv05m28n0ZHXY5DyQii1kG12A2iuhwLlICC7kyFXXwKCxzisLmri22o-GPgFkb9pzAwhsERVPBpp3Kgqa-5is2zyMMOUppZi3YP907GRIxeNZ8EEzaaytzIkJQedoBkniJxb72J7zvh2OTfiOAGSfdTD3v5Dg_AXPWce50kUYYnSsTLwXFuGxnQzLMvmG2nfzQSiaYYHtAbYJImmJ-p1Chk71AS70DPBQQtzMi0LZKvVPcsnvP9ECNVxUYKolDMDVY9XU9IHZPsJEc6rJ8GTJKFoO9z0je4ipYsEXeFMvfftbsFL1S1T83l2ShSbcdzIQDOS0dDE9dLse7H3Qic6K_nFoP6ywScMoeSv3QNLjVGmlR7rILKFNWuV198AK_mh5dR32BIE94SXu--JBDUXJXMtnZfq_Mtc-XK5cJv14v2y2D2U-x8hQswy9SZ5AImKBensRqfp8L45_kgIyn-evAysBQB8OUfWPsk4WRuWBxAI1MiP7BMomXjwgk8ThjMVUXH7SJEIo8B_PeHZqAb-8m6rhEy5Om2iR92HhIDsO2ZKBvodGCFB6APv-h9Kza4bSlRbhx615jVvQcQfFewnBrZO4iNzOzniJ1MJ6FxBELtNwDgdn8XRgQp5ab0nmwJgyYL2AkGWWigy_1xjqJrUbXfyTl49jHvMkonyYp7AA2fFLeP-AuzC4USZIJGMfiPp6bCsBRuSVl_TC1Bo8Y6yvMjBc-zS9QGRKC8WNBYNbTOYywlNeWEGFSOWKZrWd7dLDLJTRv9xfYDJnmtDJ9RiL4mK25cF2W8cp4T8SlP9uEbEzl9YbgMTBDtDSiDswJKAZEt5LV12OmFNYVW4HCYJjEpsBEP7BO3Sh4uh3vam_q_0SYlJGFnAIDAmpHCxEKzuXAhA.9KPU9CSww_RQb0i_JYN6vw"
})  # You can start a custom conversation

response = ""
for data in chatbot.ask(
  prompt_template.replace("{user_input}", "I wanna send all of my USDC on Polygon to 0x986854779804799C1d68867F5E03e601E781e41b")
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
