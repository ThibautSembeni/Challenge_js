import {ref, watch} from "vue";
import CreditCardForm from "@/components/CreditCardForm.vue";

const creditCard = {
    install(app, options) {
        console.log("install plugin")
        if (!options.SK || !options.PK) {
            console.log("error credentails invalid")
        }
        const res = Math.floor(Math.random() * 25 + 1);
        const currentCardBackground = ref(res);
        const cardHolder = ref("");
        const cardNumber = ref("");
        const cardMonth = ref("");
        const cardYear = ref("");

        const cardCvv = ref();
        const isCardFlipped = ref(false);
        const cardMasked = ref([]);


        const maskCard = (cardNumber) => {
            cardMasked.value.length = []
            for (const data of cardNumber) {

                if (cardMasked.value.length <= 18) {
                    if ([0, 1, 17, 18].includes(cardMasked.value.length)) {
                        cardMasked.value.push(data);
                    } else {
                        cardMasked.value.push("*");
                    }
                    if (cardMasked.value.length % 5 === 0 && cardMasked.value.length <= 19) {
                        cardMasked.value.splice(cardMasked.value.length - 1, 0, " ");
                    }
                } else {
                    cardMasked.value.push(data);
                }
            }
        }

        const flipCard = (shouldFlip) => {
            if (shouldFlip !== undefined) {
                isCardFlipped.value = shouldFlip;
            } else {
                isCardFlipped.value = !isCardFlipped.value;
            }
        };

        const validateForm = () => {
            alert("Form submitted successfully!");
        };

        watch([cardNumber, cardCvv, cardHolder], (newValues, oldValues) => {
            const [newCardNumber, newCardCvv, newCardName] = newValues;
            const [oldCardNumber, oldCardCvv, oldCardName] = oldValues;

            if (newCardNumber !== oldCardNumber) {
                if (newCardNumber.length === 0 && oldCardNumber.length === 4) {
                    flipCard(false);
                }

                const filteredCardNumber = newCardNumber.replace(/\D/g, '');
                cardNumber.value = filteredCardNumber.slice(0, 16);

                if (filteredCardNumber !== newCardNumber) {
                    cardNumber.value = filteredCardNumber;
                }

                if (cardNumber.value.length <= 16) {
                    maskCard(cardNumber.value);
                    return;
                }
            }

            if (newCardCvv !== oldCardCvv) {
                const filteredCardCvv = newCardCvv.replace(/\D/g, '');
                cardCvv.value = filteredCardCvv.slice(0, 3);

                if (filteredCardCvv !== newCardCvv) {
                    cardCvv.value = filteredCardCvv;
                }
            }

            if (newCardName !== oldCardName) {
                const filteredCardName = newCardName.replace(/[^a-zA-Z ]/g, '');
                cardHolder.value = filteredCardName.slice(0, 20);
            }
            this.$emit("test",{
                ossama:'dahbi'
            })
        });


        const getCardType = () => {
            let re = new RegExp("^4");
            if (cardNumber.value.toString().match(re) != null) return "visa";

            re = new RegExp("^(34|37)");
            if (cardNumber.value.toString().match(re) != null) return "amex";

            re = new RegExp("^5[1-5]");
            if (cardNumber.value.toString().match(re) != null) return "mastercard";

            re = new RegExp("^6011");
            if (cardNumber.value.toString().match(re) != null) return "discover";

            return "visa"; // default type
        };
        const blurInput = () => {
            document.querySelectorAll(".card-item__side").forEach((element) => {
                element.classList.remove("-active");
            });
        };
        const focusInput = (event) => {
            const targetRef = event.target.getAttribute("data-ref");
            if (targetRef === "cardNumber") {
                isCardFlipped.value = false;
            }
            document.querySelectorAll(".card-item__side").forEach((element) => {
                const cardSide = element.classList.contains("-back") ? "back" : "front";
                if (cardSide === targetRef) {
                    element.classList.add("-active");
                }
            });
        };
        app.config.globalProperties.$creditCardForm = {
            currentCardBackground,
            cardHolder,
            cardNumber,
            cardMonth,
            cardYear,
            cardCvv,
            isCardFlipped,
            cardMasked,
            maskCard,
            flipCard,
            validateForm,
            blurInput,
            focusInput,
            cardType: getCardType(),
            emitCardInfo(cardInfo) {
                app.config.globalProperties.$emit('card', cardInfo);
            },
        };

        app.component('credit-card-form', CreditCardForm);

    }

};

export default creditCard;
