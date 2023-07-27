<script>
export default {
  data() {
    return {
      cardHolderInput: this.$creditCardForm.cardHolder,
      cardMonthInput: this.$creditCardForm.cardMonth,
      cardYearInput: this.$creditCardForm.cardYear,
      cardNumberInput: this.$creditCardForm.cardNumber,
      cardCvvInput: this.$creditCardForm.cardCvv,
      currentCardBackground: this.$creditCardForm.currentCardBackground,
      isCardFlipped: this.$creditCardForm.isCardFlipped,
      cardMasked: this.$creditCardForm.cardMasked,
      currentYear: new Date().getFullYear(),
      isValidPayload: false,
    };
  },
  methods: {
    flipCard(shouldFlip) {
      return this.$creditCardForm.flipCard(shouldFlip)
    },
    updateCardData() {
      this.cardData = {
        cardNumber: this.cardNumberInput,
        cardHolder: this.cardHolderInput,
        cardMonth: this.cardMonthInput,
        cardYear: this.cardYearInput,
        cardCvv: this.cardCvvInput,
      };
      this.validPayload();
    },
    validPayload() {
      const {cardNumber, cardHolder, cardMonth, cardYear, cardCvv} = this.cardData
      const validCardYer = Number(cardYear) > 0
      const validCardMonth = Number(cardMonth) > 0
      const validCardHolder = cardHolder.length > 0 && cardHolder.length < 50
      const validCardNumber = cardNumber.length === 16
      const validCardCvv = cardCvv?.length === 3
      this.isValidPayload = validCardYer && validCardMonth && validCardHolder && validCardNumber && validCardCvv;
    },
    submitPayment(){
      this.$emit('submit', this.cardData);
    },
    cancelPayment(){
      this.$emit('cancel');
    },

  },
  watch: {
    cardNumberInput: {
      handler() {
        this.updateCardData();
      },
    },
    cardHolderInput: {
      handler() {
        this.updateCardData();
      },
    },
    cardMonthInput: {
      handler() {
        this.updateCardData();
      },
    },
    cardYearInput: {
      handler() {
        this.updateCardData();
      },
    },
    cardCvvInput: {
      handler() {
        this.updateCardData();
      },
    },
  },
};
</script>
<template>
  <div class="h-screen flex justify-center items-center">
    <div class="">
      "{{ isValidPayload }}"
      <div class="card-form">
        <div class="card-list">
          <div class="card-item" :class="{ '-active' : isCardFlipped }">
            <div class="card-item__side -front">
              <div class="card-item__focus"></div>
              <div class="card-item__cover">
                <img
                    :src="'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/' + currentCardBackground + '.jpeg'"
                    class="card-item__bg">
              </div>
              <div class="card-item__wrapper">
                <div class="card-item__top">
                  <img
                      src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/chip.png"
                      class="card-item__chip">
                  <div class="card-item__type">
                    <transition name="slide-fade-up">
                      <img
                          :src="'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/'+ $creditCardForm.cardType+'.png'"
                          alt="" class="card-item__typeImg">
                    </transition>
                  </div>
                </div>
                <label for="cardNumber" class="card-item__number">
                <span>
                  <div class="card-item__numberItem"></div>
                </span>

                  <span v-for="(n, index) in cardMasked" :key="index">
                    <transition name="slide-fade-up">

                      <div class="card-item__numberItem">
                        <span>
                        {{ n }}
                        </span>
                      </div>
                    </transition>
                  </span>

                </label>


                <div class="card-item__content">
                  <label for="cardName" class="card-item__info">
                    <div class="card-item__holder">Card Holder</div>
                    <transition name="slide-fade-up">
                      <div class="card-item__name" v-if="cardHolderInput.length" :key="1">
                        <transition-group name="slide-fade-right">
                        <span class="card-item__nameItem" v-for="(n, $index) in cardHolderInput.replace(/\s\s+/g, ' ')"
                              :key="$index + 1">{{ n }}</span>
                        </transition-group>
                      </div>
                      <div class="card-item__name" v-else :key="2">Full Name</div>
                    </transition>
                  </label>
                  <div class="card-item__date" ref="cardDate">
                    <label for="cardMonth" class="card-item__dateTitle">Expires</label>
                    <label for="cardMonth" class="card-item__dateItem">
                      <transition name="slide-fade-up">
                        <span v-if="cardMonthInput" :key="cardMonthInput">{{ cardMonthInput }}</span>
                        <span v-else :key="2">MM</span>
                      </transition>
                    </label>
                    /
                    <label for="cardYear" class="card-item__dateItem">
                      <transition name="slide-fade-up">
                        <span v-if="cardYearInput" :key="cardYearInput">{{ cardYearInput }}</span>
                        <span v-else :key="2">YY</span>
                      </transition>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-item__side -back">

              <div class="card-item__cover">
                <img
                    :src="'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/' + currentCardBackground + '.jpeg'"
                    class="card-item__bg">
              </div>
              <div class="card-item__band"></div>
              <div class="card-item__cvv">
                <div class="card-item__cvvTitle">CVV</div>
                <div class="card-item__cvvBand">{{ cardCvvInput }}</div>
                <div class="card-item__type">
                  <img
                      :src="'https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/' +  $creditCardForm.cardType + '.png'"
                      alt="" class="card-item__typeImg">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-form__inner">
          <div class="card-input">
            <label for="cardNumber" class="card-input__label">Card Number</label>
            <input type="text" id="cardNumber" class="card-input__input" v-model="cardNumberInput"
                   @focus="$creditCardForm.focusInput" data-ref="cardNumber" autocomplete="off">
          </div>
          <div class="card-input">
            <label for="cardName" class="card-input__label">Card Holders</label>
            <input type="text" id="cardName" class="card-input__input" v-model="cardHolderInput"
                   @focus="$creditCardForm.focusInput"
                   @blur="$creditCardForm.blurInput" data-ref="cardName" autocomplete="off">
          </div>
          <div class="card-form__row">
            <div class="card-form__col">
              <div class="card-form__group">
                <label for="cardMonth" class="card-input__label">Expiration Date</label>
                <select class="card-input__input -select" id="cardMonth" v-model="cardMonthInput"
                        @focus="$creditCardForm.focusInput"
                        @blur="$creditCardForm.blurInput" data-ref="cardDate">
                  <option value="" disabled selected>Month</option>
                  <option :value="n < 10 ? '0' + n : n" v-for="n in 12" :disabled="n < $creditCardForm.minCardMonth"
                          :key="n">
                    {{ n < 10 ? '0' + n : n }}
                  </option>
                </select>
                <select class="card-input__input -select" id="cardYear" v-model="cardYearInput"
                        @focus="$creditCardForm.focusInput"
                        data-ref="cardDate">
                  <option value="" disabled selected>Year</option>
                  <option :value="String(currentYear + n).slice(2, 4)" v-for="n in 20" :key="n">
                    {{ String(currentYear + n).slice(2, 4) }}
                  </option>
                </select>
              </div>
            </div>
            <div class="card-form__col -cvv">
              <div class="card-input">
                <label for="cardCvv" class="card-input__label">CVV</label>
                <input type="text" class="card-input__input" id="cardCvv" v-model="cardCvvInput"
                       @focus="flipCard(true)" @blur="flipCard(false)" data-ref="cardCvv" autocomplete="off">
              </div>
            </div>
          </div>
          <button
              class="w-full h-16 bg-blue-500 rounded-md text-white text-lg font-semibold shadow-md mt-5 cursor-pointer transition-opacity duration-300"
              :class="{ 'pointer-events-none opacity-70': !isValidPayload }"
              :disabled="!isValidPayload"
              @click.prevent="submitPayment"
          >
            Submit</button>
          <button
              class="w-full h-16 bg-transparent border border-red-500 hover:bg-red-100 rounded-md text-red-500 text-lg font-semibold shadow-md mt-5 cursor-pointer transition-opacity duration-300"
              @click.prevent="cancelPayment"
          >
            Cancel
          </button>


        </div>

      </div>
    </div>
  </div>
</template>


<style scoped>
.wrapper {
  min-height: 100vh;
  display: flex;
  padding: 50px 15px;
}


.card-form {
  max-width: 570px;
  margin: auto;
  width: 100%;
}

.card-form__inner {
  background: #fff;
  box-shadow: 0 30px 60px 0 rgba(90, 116, 148, 0.4);
  border-radius: 10px;
  padding: 10% 35px 35px;
}

.card-form__row {
  display: flex;
  align-items: flex-start;
}

.card-form__col {
  flex: auto;
  margin-right: 35px;
}

.card-form__col:last-child {
  margin-right: 0;
}

.card-form__col.-cvv {
  max-width: 150px;
}

.card-form__group {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
}

.card-form__group .card-input__input {
  flex: 1;
  margin-right: 15px;
}

.card-form__group .card-input__input:last-child {
  margin-right: 0;
}

.card-form__button {
  width: 100%;
  height: 55px;
  background: #2364d2;
  border: none;
  border-radius: 5px;
  font-size: 22px;
  font-weight: 500;
  font-family: "Source Sans Pro", sans-serif;
  box-shadow: 3px 10px 20px 0px rgba(35, 100, 210, 0.3);
  color: #fff;
  margin-top: 20px;
  cursor: pointer;
}


.card-item {
  max-width: 430px;
  height: 270px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 2;
  width: 100%;
}

.card-item.-active .card-item__side.-front {
  transform: perspective(1000px) rotateY(180deg) rotateX(0deg) rotateZ(0deg);
}

.card-item.-active .card-item__side.-back {
  transform: perspective(1000px) rotateY(0) rotateX(0deg) rotateZ(0deg);
}

.card-item__focus {
  position: absolute;
  z-index: 3;
  border-radius: 5px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: all 0.35s cubic-bezier(0.71, 0.03, 0.56, 0.85);
  opacity: 0;
  pointer-events: none;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.65);
}

.card-item__focus:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: #08142f;
  height: 100%;
  border-radius: 5px;
  filter: blur(25px);
  opacity: 0.5;
}

.card-item__focus.-active {
  opacity: 1;
}

.card-item__side {
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 20px 60px 0 rgba(14, 42, 90, 0.55);
  transform: perspective(2000px) rotateY(0deg) rotateX(0deg) rotate(0deg);
  transform-style: preserve-3d;
  transition: all 0.8s cubic-bezier(0.71, 0.03, 0.56, 0.85);
  backface-visibility: hidden;
  height: 100%;
}

.card-item__side.-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transform: perspective(2000px) rotateY(-180deg) rotateX(0deg) rotate(0deg);
  z-index: 2;
  padding: 0;
  height: 100%;
}

.card-item__side.-back .card-item__cover {
  transform: rotateY(-180deg);
}

.card-item__bg {
  max-width: 100%;
  display: block;
  max-height: 100%;
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.card-item__cover {
  height: 100%;
  background-color: #1c1d27;
  position: absolute;
  height: 100%;
  background-color: #1c1d27;
  left: 0;
  top: 0;
  width: 100%;
  border-radius: 15px;
  overflow: hidden;
}

.card-item__cover:after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(6, 2, 29, 0.45);
}

.card-item__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 40px;
  padding: 0 10px;
}

.card-item__chip {
  width: 60px;
}

.card-item__type {
  height: 45px;
  position: relative;
  display: flex;
  justify-content: flex-end;
  max-width: 100px;
  margin-left: auto;
  width: 100%;
}

.card-item__typeImg {
  max-width: 100%;
  object-fit: contain;
  max-height: 100%;
  object-position: top right;
}

.card-item__info {
  color: #fff;
  width: 100%;
  max-width: calc(100% - 85px);
  padding: 10px 15px;
  font-weight: 500;
  display: block;
  cursor: pointer;
}

.card-item__holder {
  opacity: 0.7;
  font-size: 13px;
  margin-bottom: 6px;
}

.card-item__wrapper {
  font-family: "Source Code Pro", monospace;
  padding: 25px 15px;
  position: relative;
  z-index: 4;
  height: 100%;
  text-shadow: 7px 6px 10px rgba(14, 42, 90, 0.8);
  user-select: none;
}

.card-item__name {
  font-size: 18px;
  line-height: 1;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
}

.card-item__nameItem {
  display: inline-block;
  min-width: 8px;
  position: relative;
}

.card-item__number {
  font-weight: 500;
  line-height: 1;
  color: #fff;
  font-size: 27px;
  margin-bottom: 35px;
  display: inline-block;
  padding: 10px 15px;
  cursor: pointer;
}


.card-item__numberItem {
  width: 16px;
  display: inline-block;
}

.card-item__numberItem.-active {
  width: 30px;
}

.card-item__content {
  color: #fff;
  display: flex;
  align-items: flex-start;
}

.card-item__date {
  flex-wrap: wrap;
  font-size: 18px;
  margin-left: auto;
  padding: 10px;
  display: inline-flex;
  width: 80px;
  white-space: nowrap;
  flex-shrink: 0;
  cursor: pointer;
}


.card-item__dateItem {
  position: relative;
}

.card-item__dateItem span {
  width: 22px;
  display: inline-block;
}

.card-item__dateTitle {
  opacity: 0.7;
  font-size: 13px;
  padding-bottom: 6px;
  width: 100%;
}


.card-item__band {
  background: rgba(0, 0, 19, 0.8);
  width: 100%;
  height: 50px;
  margin-top: 30px;
  position: relative;
  z-index: 2;
}


.card-item__cvv {
  text-align: right;
  position: relative;
  z-index: 2;
  padding: 15px;
}

.card-item__cvv .card-item__type {
  opacity: 0.7;
}

@media screen and (max-width: 360px) {
  .card-item__cvv {
    padding: 10px 15px;
  }
}

.card-item__cvvTitle {
  padding-right: 10px;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 5px;
}

.card-item__cvvBand {
  height: 45px;
  background: #fff;
  margin-bottom: 30px;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  color: #1a3b5d;
  font-size: 18px;
  border-radius: 4px;
  box-shadow: 0px 10px 20px -7px rgba(32, 56, 117, 0.35);
}


.card-input {
  margin-bottom: 20px;
}

.card-input__label {
  font-size: 14px;
  margin-bottom: 5px;
  font-weight: 500;
  color: #1a3b5d;
  width: 100%;
  display: block;
  user-select: none;
}

.card-input__input {
  width: 100%;
  height: 50px;
  border-radius: 5px;
  box-shadow: none;
  border: 1px solid #ced6e0;
  transition: all 0.3s ease-in-out;
  font-size: 18px;
  padding: 5px 15px;
  background: none;
  color: #1a3b5d;
  font-family: "Source Sans Pro", sans-serif;
}

.card-input__input:hover, .card-input__input:focus {
  border-color: #3d9cff;
}

.card-input__input:focus {
  box-shadow: 0px 10px 20px -13px rgba(32, 56, 117, 0.35);
}

.card-input__input.-select {
  -webkit-appearance: none;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAeCAYAAABuUU38AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAUxJREFUeNrM1sEJwkAQBdCsngXPHsQO9O5FS7AAMVYgdqAd2IGCDWgFnryLFQiCZ8EGnJUNimiyM/tnk4HNEAg/8y6ZmMRVqz9eUJvRaSbvutCZ347bXVJy/ZnvTmdJ862Me+hAbZCTs6GHpyUi1tTSvPnqTpoWZPUa7W7ncT3vK4h4zVejy8QzM3WhVUO8ykI6jOxoGA4ig3BLHcNFSCGqGAkig2yqgpEiMsjSfY9LxYQg7L6r0X6wS29YJiYQYecemY+wHrXD1+bklGhpAhBDeu/JfIVGxaAQ9sb8CI+CQSJ+QmJg0Ii/EE2MBiIXooHRQhRCkBhNhBcEhLkwf05ZCG8ICCOpk0MULmvDSY2M8UawIRExLIQIEgHDRoghihgRIgiigBEjgiFATBACAgFgghEwSAAGgoBCBBgYAg5hYKAIFYgHBo6w9RRgAFfy160QuV8NAAAAAElFTkSuQmCC");
  background-size: 12px;
  background-position: 90% center;
  background-repeat: no-repeat;
  padding-right: 30px;
}

</style>