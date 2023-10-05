<template>
    <div class="receipt-parent">
        <div class="receipt-body">
            <div class="logo">
              <img src="~assets/Layer_1.svg" alt="">
            </div>

            <div class="receipt-details">
              <div class="name-info">
                <span>Name:</span>
                <span>{{receiptDetails.name}}</span>
              </div>
              <div class="name-info">
                <span>Account No:</span>
                <span>{{receiptDetails.account_number}}</span>
              </div>
              <div class="name-info">
                <span>Transaction Reference ID:</span>
                <span>{{receiptDetails.transaction_reference_id}}</span>
              </div>
              <div class="name-info">
                <span>Transaction Points:</span>
                <span>{{receiptDetails.transaction_points}}</span>
              </div>
              <div class="name-info">
                <span>Transaction Type:</span>
                <span>{{receiptDetails.transaction_type}}</span>
              </div>
              <div class="name-info">
                <span>Receipt Amount:</span>
                <span>{{receiptDetails.reciept_amount}}</span>
              </div>
              <div class="name-info">
                <span>Previous Balance:</span>
                <span>{{receiptDetails.previous_balance}}</span>
              </div>
              <div class="name-info">
                <span>New Balance:</span>
                <span>{{receiptDetails.new_balance}}</span>
              </div>

            </div>
            <span style="display: flex; justify-content: right;">
              {{ today }}
            </span>

        </div>
    </div>
</template>

<script setup>
  import { ref, onMounted } from "vue";

// import QRCodeVue3 from "qrcode-vue3";
//   import cardImage from '../assets/card-image.png';
  // const { name, qrCode, type, account_number } = defineProps(['name', 'qrCode', 'type', 'account_number']);
  const { receiptDetails } = defineProps(['receiptDetails']);
  const today = ref('')


onMounted(() => {
  // Get the current date
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  today.value = new Date().toLocaleDateString(undefined, options);
});
</script>

<style scoped>



.label {
  margin-right: 10px; /* Adjust the value to control the spacing */
}

.receipt-parent {
    width: auto;
    /* border: 1px solid; */
    margin: 0 auto;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 10px;
    background: linear-gradient(to left, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 1)),
  url("src/assets/bgbg.png");
  background-size: cover;
}

.qr-receipt {
  display: flex;
  margin-top: 20px;
}

.logo {
  display: flex;
  width: 100%;
}

.receipt-details {
  margin-top: 15px;
  display: grid;
  place-content: center;
  font-weight: bold;
}

.name-info {
  display: flex;
  justify-content: space-between;
  border-bottom: dotted;
  margin-bottom: 5px;

}
/* .receipt-details span {
  border-bottom: dotted;
  margin: 3px;
} */
.receipt-body img {
  width: 80px;
  margin: 0 auto;
}

</style>
