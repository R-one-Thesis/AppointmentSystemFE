<template>
    <div class="card printContent" id="testest">
        <div class="top-details">
            <img src="~assets/Layer_1.svg" alt="">
        </div>
        <div class="bot-details">
          <QRCodeVue3
              :width="250"
              :height="250"
              :image=cardImage
              :value="qrCode"

              :qrOptions="{
                typeNumber: 0,
                mode: 'Byte',
                errorCorrectionLevel: 'H',
              }"
              :imageOptions="{
                hideBackgroundDots: true,
                imageSize: 0.4,
                margin: 0,
              }"
              :dotsOptions="{
                type: 'square',
                color: 'black',
                gradient: {
                  type: 'linear',
                  rotation: 0,
                  colorStops: [
                    { offset: 0, color: 'black' },
                    { offset: 1, color: 'black' },
                  ],
                },
              }"
              :corners-square-options="{
                type: 'square',
                color: 'black',

              }"
              :corners-dot-options="{
                type: 'square',
                color: 'black',

              }"
              :backgroundOptions="{ color: '#ffffff' }"

              fileExt="png"
              :download="false"
              myclass="my-qur"
              imgclass="img-qr"
              downloadButton="my-button"
              :downloadOptions="{ name: 'vqr', extension: 'png' }"
            />
            <div class="details" >
                <h5>{{ name  }}</h5>


                <!-- <p>{{ account_number.substr(0, 3) }}<span style="background-color: white; margin: 0 2px"><span style="opacity: 0;">{{  '*'.repeat(account_number.length - 6) }}</span></span>{{  account_number.substr(-3) }} </p> -->
                <p>{{ account_number }} </p>
                <p>{{ type }} Card</p>
            </div>
        </div>

    </div>
</template>

  <script setup>

  import QRCodeVue3 from "qrcode-vue3";
  import cardImage from '../assets/card-image.png';
  const { name, qrCode, type, account_number } = defineProps(['name', 'qrCode', 'type', 'account_number']);



  </script>

<style scoped>
.card {
    /* border: 1px solid; */
    width: 316px;
    height: 196px;
    /* margin: 0 auto; */
    background: linear-gradient(to left, rgba(255, 255, 255, 0.60), rgba(255, 255, 255, 1)),
  url("src/assets/bgbg.png");
  background-size: cover;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -2px;
  border-radius: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: "OCR-A Extended", monospace;
  font-size: 24px;
  letter-spacing: 2px;


}

.top-details {
    width: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.card img {
    width: 75px;
}
.card .bot-details .my-qur .img-qr {
    width: 75px !important;
}
.bot-details {
    display: flex;
    align-items: center;
    padding: 0 15px ;
    height: 100%;
    gap: 20px;
    width: 280px;
    border-radius: 0px 50px 0px 0px;
    background: #876943;
    color: #fff;
}

.bot-details h5 {
   font-weight: bold;
    margin: 0;
    font-size: 14px;
    line-height: 1.2 !important;

}
.bot-details p {
    margin: 0;
    font-size: 12px;
}
.my-qur{

  line-height: 0 !important;
}
</style>
