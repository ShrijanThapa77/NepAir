import myKey from "./khaltiKey.jsx";
import axios from "axios";
let config = {
  // replace this key with yours
  publicKey: "6a7e5e2e8638433db08d6585a253bbf8",
  productIdentity: "123766",
  productName: "NepAir",
  productUrl: "http://localhost:3000",
  eventHandler: {
    onSuccess(payload) {
      // hit merchant api for initiating verfication
      console.log(payload);
      let data = {
        token: payload.token,
        amount: payload.amount,
      };

      axios
        .get(
          `https://meslaforum.herokuapp.com/khalti/${data.token}/${data.amount}/${myKey.secretKey}`
        )
        .then((response) => {
          console.log(response.data);
          alert("Thank you for generosity");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // onError handler is optional
    onError(error) {
      // handle errors
      console.log(error);
    },
    onClose() {
      console.log("widget is closing");
    },
  },
  paymentPreference: [
    "KHALTI",
    "EBANKING",
    "MOBILE_BANKING",
    "CONNECT_IPS",
    "SCT",
  ],
};

export default function Khalti() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <button> Pay via khalti</button>
    </div>
  );
}