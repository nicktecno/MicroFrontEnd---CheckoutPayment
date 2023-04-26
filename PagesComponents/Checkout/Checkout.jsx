import React, { useState, useEffect } from "react";
import Link from "next/link";

import notification from "../../services/notification";
import currencyFormat from "../../services/currencyFormat";

import { CreditCardFill } from "@styled-icons/bootstrap/CreditCardFill";
import { Pix } from "@styled-icons/fa-brands/Pix";
import { Barcode } from "@styled-icons/ionicons-sharp/Barcode";

import * as S from "./style";

import { useRouter } from "next/router";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputMask from "react-input-mask";

import Toggle from "react-toggle";
import "react-toggle/style.css";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const Payment = ({ api, setCartLength, routeTranslations }) => {
  const history = useRouter();

  const [cart, setCart] = useState();

  const [paymentChoice, setPaymentChoice] = useState();
  const [paymentsMethods, setPaymentsMethods] = useState([]);
  const [myCards, setMyCards] = useState([]);
  const [newCard, setNewCard] = useState(false);
  const [choosedCard, setChoosedCard] = useState({ id: "" });
  const [choosedPortion, setChoosedPortion] = useState("");
  const [paymentFinished, setPaymentFinished] = useState(false);

  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    card_name: yup.string().required("Digite o nome como está no seu cartão"),
    card_number: yup
      .string()
      .min(19, "O cartão deve possuir 16 números")
      .required("Digite o número do cartão"),

    expiration: yup
      .string()
      .max(5, "Digite uma data de de validade válida.")
      .matches(/([0-9]{2})\/([0-9]{2})/, "Digite uma data de validade válida.")
      .required("Digite a data de validade"),
    vat_number: yup
      .string()
      .required("Digite seu CPF")
      .min(11, "O CPF deve conter 11 números")
      .transform((value) => value.split(/[-._/]/).join("")),

    cvv: yup
      .string()
      .min(3, "O CVV possuí no mínimo 3 números")
      .max(4, "O CVV possuí no máximo 4 números")
      .required("Digite o CVV do seu cartão"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  function handleChoosedCard(selectedCard) {
    const filterCard = myCards.filter((myCard) => myCard.id === selectedCard);
    setChoosedCard(filterCard[0]);
  }
  function handleChoosedPortion(selectedPortion) {
    setChoosedPortion(selectedPortion);
  }

  function dataLayer(id) {
    const actionField = Object.values(cart.sellers).map((produto, index) => ({
      id: String(id),
      affiliation: produto.name,
      price: produto.subtotal,
      tax: cart.tax_total.slice(0, -2),
      shipping: String(
        cart.selected_shipping_rate[
          produto.items[0].additional.seller_info.seller_id
        ].price.toFixed(2)
      ),
    }));

    const products = Object.values(cart.sellers).map(
      (produto) => produto.items
    );
    function undefinedFilter(value) {
      return value !== undefined;
    }

    const reduce = products.reduce(function (acc, elemento, index) {
      const Affiliation = Object.values(cart.sellers).map(
        (produto) => produto.name
      );

      const produto = elemento.map(function (produtoAfiliado) {
        const brand = produtoAfiliado.product.attributes
          .map(function (atributo) {
            if (atributo.code === "brand") {
              return atributo.value;
            } else {
              return;
            }
          })
          .filter(undefinedFilter);

        return {
          affiliation: Affiliation[index],
          name: produtoAfiliado.name,
          id: String(produtoAfiliado.id),
          price: produtoAfiliado.price.slice(0, -2),
          brand: brand[0] || "",
          variant: produtoAfiliado.sku,
          quantity: produtoAfiliado.additional.quantity,
          coupon: cart.coupon_code !== null ? cart.coupon_code : "",
        };
      });
      acc.push(produto);
      return acc;
    }, []);
    reduce.forEach(
      (produto, index) =>
        window?.dataLayer &&
        window?.dataLayer.push({
          event: "orderPlaced",
          ecommerce: {
            purchase: {
              actionField: actionField[index],
              products: produto,
            },
          },
        })
    );
  }

  const saveNewCard = async (cardData) => {
    const dataCard = {
      name: cardData.card_name,
      number: cardData.card_number.replaceAll(".", ""),
      cvv: cardData.cvv,
      date_expiration: cardData.expiration.replace("/", ""),
    };

    try {
      await api.post("/customer/v2/cards/create", dataCard);
    } catch (e) {
      notification("Erro ao salvar novo cartão", "error");
      console.log(e.message);
    }
  };
  function checkoutOption(metodo) {
    window.dataLayer.push({
      event: "checkoutOption",
      ecommerce: {
        checkout_option: {
          actionField: { step: 1, option: metodo },
        },
      },
    });
  }

  useEffect(() => {
    setLoading(true);
    (async function () {
      try {
        const { data: response } = await api.get("/customer/checkout/cart", {});

        if (!response.data) {
          notification("Seu carrinho está vazio", "error");
          history.push("/search");
        }

        if (response.data) {
          const carrinho = Object.values(response.data.sellers);
          const produto = carrinho.map((item) => item.items).flat();

          function undefinedFilter(value) {
            return value !== undefined;
          }

          const produtos = produto.map(function (itemDoItem, index) {
            const variant = itemDoItem.product.attributes
              .map(function (atributo) {
                if (atributo.configurable === true) {
                  return atributo.value;
                } else {
                  return;
                }
              })
              .filter(undefinedFilter);

            const brand = itemDoItem.product.attributes
              .map(function (atributo) {
                if (atributo.code === "brand") {
                  return atributo.value;
                } else {
                  return;
                }
              })
              .filter(undefinedFilter);

            return {
              name: itemDoItem.name,
              id: String(itemDoItem.product.id),
              price: itemDoItem.price.slice(0, -2),
              brand: brand[0] || "",
              variant: variant[0] || "",
              quantity: itemDoItem.quantity,
            };
          });

          window.dataLayer.push({
            event: "checkout",
            ecommerce: {
              checkout: {
                actionField: { step: 2, option: "Not Selected" },
                products: produtos,
              },
            },
          });

          if (!response.data.selected_shipping) {
            notification("Forma de envio não selecionada", "error");
            history.push("/cart");
          }
        }

        if (response.data === null) {
          setCartLength(0);
          history.push("/profile");
        }

        setCart({
          ...response.data,
          grand_total: currencyFormat(response.data?.grand_total),
        });

        const { data: responseNewCall } = await api.get(
          "/customer/checkout/v2/calcule-payment"
        );

        setPaymentsMethods(responseNewCall.data);

        const { data: responseMyCards } = await api.get("/customer/cards");

        if (responseMyCards.data.length === 0) {
          setNewCard(true);
        }
        setMyCards(responseMyCards.data);
      } catch {
        notification("Erro ao processar o carrinho", "error");
        history.push("/cart");
      } finally {
        setLoading(false);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePayment = async (userData) => {
    setLoading(true);
    const visitorId = Konduto.getVisitorID();

    if (paymentChoice === "credit_card") {
      if (choosedPortion !== "") {
        if (userData !== undefined && userData.saveCard && newCard) {
          saveNewCard(userData);
        }
        if (!newCard && choosedCard.id === "") {
          notification("Selecione um cartão da lista", "error");
          setLoading(false);
          return;
        }

        const portionsData = Object.values(
          paymentsMethods.filter((method) => method.method === "credit_card")[0]
            .value
        )
          .map((card, index) => {
            if (card === choosedPortion) {
              return index + 1;
            } else {
              return [];
            }
          })
          .flat()[0];

        const dataPayment = {
          visitor: visitorId,
          payment: {
            gateway: "CazcoPay",
            method: paymentChoice,
            installment: portionsData,
            installment_value: parseFloat(cart?.base_grand_total),

            card: {
              number: userData?.card_number.replaceAll(".", ""),
              holder_name: userData?.card_name,
              cvv: userData?.cvv,
              exp_year: "20" + userData?.expiration.split("/")[1],
              exp_month: userData?.expiration.split("/")[0],
              tax_id: userData?.vat_number,
            },
          },
        };
        const dataPaymentCardList = {
          visitor: visitorId,
          payment: {
            gateway: "CazcoPay",
            method: paymentChoice,
            installment: portionsData,
            installment_value: parseFloat(cart?.base_grand_total),

            card: {
              id: !newCard && Number(choosedCard.card_id),
            },
          },
        };
        try {
          const { data: responseFinished } = await api.post(
            "/customer/checkout/v2/save-payment",
            newCard ? dataPayment : dataPaymentCardList
          );
          notification("O pagamento está sendo processado!", "success");

          dataLayer(responseFinished.message.order_id);

          setCartLength(0);
          history.push(`/profile/orders/${responseFinished.message.order_id}`);
        } catch (e) {
          console.log(e);
          setLoading(false);
          notification("Erro ao processar pagamento", "error");
        } finally {
        }
      } else {
        notification("Selecione o número de parcelas", "error");
        setLoading(false);
        return;
      }
    } else {
      const dataPayment = {
        visitor: visitorId,
        payment: {
          gateway: "CazcoPay",
          method: paymentChoice,
          installment: 1,
          installment_value: parseFloat(cart?.base_grand_total),
        },
      };

      try {
        const { data: responseFinished } = await api.post(
          "/customer/checkout/v2/save-payment",
          dataPayment
        );
        notification("O pagamento está sendo processado!", "success");

        dataLayer(responseFinished.message.order_id);

        setCartLength(0);
        history.push(`/profile/orders/${responseFinished.message.order_id}`);
      } catch (e) {
        console.log(e);
        setLoading(false);
        notification("Erro ao processar pagamento", "error");
      } finally {
      }
    }
  };

  return (
    <>
      <S.ContainerGeneral>
        <S.Breadcrumb>
          <p>
            <Link href="/cart">Carrinho de Compras &#62; </Link>
            <span>Pagamento</span>
          </p>
        </S.Breadcrumb>

        {loading ? (
          <S.ContainerLoading>
            <img src="/images/loadingIcon.svg" alt="Loading..." />
          </S.ContainerLoading>
        ) : (
          <>
            <div className="title">Formas de Pagamento</div>
            <S.ContainerGeneralPayment onSubmit={handleSubmit(handlePayment)}>
              <S.ContainerPaymentMethods>
                <div className="containerMethods">
                  {paymentsMethods.length > 0 &&
                    paymentsMethods.map((method, index) => (
                      <div
                        key={index}
                        className={
                          method.method === paymentChoice
                            ? "card selected"
                            : "card"
                        }
                        onClick={() => {
                          setPaymentChoice(method.method);
                          checkoutOption(method.method);
                        }}
                      >
                        <div className="name">
                          {method.method === "credit_card"
                            ? "Cartão de Crédito"
                            : method.method === "billet"
                            ? "Boleto"
                            : "Pix"}
                        </div>
                        <div className="image">
                          {method.method === "credit_card" ? (
                            <CreditCardFill />
                          ) : method.method === "billet" ? (
                            <Barcode />
                          ) : (
                            <Pix />
                          )}
                        </div>
                      </div>
                    ))}
                </div>

                <div className="containerMethodChoosed">
                  {paymentChoice === "billet" && (
                    <div className="containerBillet">
                      Você receberá o boleto e mais informações sobre o seu
                      pedido no e-mail <br />
                      <br />
                      <strong>{cart.customer_email}</strong>
                    </div>
                  )}
                  {paymentChoice === "pix" && (
                    <div className="containerBillet">
                      Finalize o pedido para exibir um QR code e um código de
                      Pix Copie e Cole para pagar
                    </div>
                  )}

                  {myCards.length > 0 && paymentChoice === "credit_card" && (
                    <div className="containerToggle">
                      <div className="toggleNewCard">Cadastrar novo cartão</div>
                      <Toggle
                        defaultChecked={newCard}
                        onChange={() => {
                          setNewCard((prev) => !prev);
                          setChoosedPortion("");
                        }}
                      />
                    </div>
                  )}
                  {myCards.length > 0 &&
                    !newCard &&
                    paymentChoice === "credit_card" && (
                      <div className="containerSelectsNewCard">
                        <S.InputArea
                          errorForm={
                            paymentChoice === "credit_card" &&
                            paymentFinished &&
                            choosedCard.id === "" &&
                            newCard === false &&
                            true
                          }
                        >
                          <FormControl variant="standard">
                            <InputLabel id="demo-simple-select-standard-label">
                              Meus Cartões
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={choosedCard.id}
                              label="Meus Cartões"
                              onChange={(e) =>
                                handleChoosedCard(e.target.value)
                              }
                            >
                              {myCards.length > 0 &&
                                myCards.map((card, index) => (
                                  <MenuItem value={card.id} key={index}>
                                    **** **** **** {card.last_digits}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </S.InputArea>
                        {choosedCard.id !== "" && (
                          <S.InputArea
                            errorForm={
                              paymentChoice === "credit_card" &&
                              paymentFinished &&
                              choosedPortion === "" &&
                              newCard === false &&
                              true
                            }
                          >
                            <FormControl variant="standard">
                              <InputLabel id="demo-simple-select-standard-label">
                                Parcelas
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={choosedPortion}
                                label="Parcelas"
                                onChange={(e) =>
                                  handleChoosedPortion(e.target.value)
                                }
                              >
                                {Object.values(
                                  paymentsMethods.filter(
                                    (method) => method.method === "credit_card"
                                  )[0].value
                                ).map((portions, index) => (
                                  <MenuItem value={portions} key={index}>
                                    {`${index + 1}x ${currencyFormat(
                                      portions
                                    )} `}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </S.InputArea>
                        )}
                      </div>
                    )}
                  {paymentChoice === "credit_card" && newCard && (
                    <S.Form>
                      <span>
                        <S.InputArea>
                          <label>Nome no cartão</label>
                          <input
                            style={{
                              border:
                                errors.card_name?.message &&
                                "3px solid #ce171f",
                            }}
                            type="text"
                            placeholder={"Digite aqui"}
                            {...register("card_name")}
                          />
                        </S.InputArea>

                        <S.InputArea>
                          <label>Número do cartão</label>
                          <InputMask
                            style={{
                              border:
                                errors.card_number?.message &&
                                "3px solid #ce171f",
                            }}
                            mask={"9999.9999.9999.9999"}
                            placeholder={"Digite aqui (somente números)"}
                            type="text"
                            {...register("card_number")}
                          />
                        </S.InputArea>

                        <S.InputArea>
                          <label>Validade (MM/AA)</label>
                          <InputMask
                            style={{
                              border:
                                errors.expiration?.message &&
                                "3px solid #ce171f",
                            }}
                            mask={"99/99"}
                            placeholder={"Digite aqui (somente números)"}
                            type="text"
                            {...register("expiration")}
                          />
                        </S.InputArea>

                        <S.InputArea>
                          <label>CPF</label>
                          <InputMask
                            style={{
                              border:
                                errors.vat_number?.message &&
                                "3px solid #ce171f",
                            }}
                            mask={"999.999.999-99"}
                            placeholder={"Digite aqui (somente números)"}
                            type="text"
                            {...register("vat_number")}
                          />
                        </S.InputArea>

                        <S.InputArea>
                          <label>CVV</label>
                          <InputMask
                            style={{
                              border:
                                errors.cvv?.message && "3px solid #ce171f",
                            }}
                            maskChar=""
                            mask={"9999"}
                            placeholder={"Digite aqui (somente números)"}
                            type="text"
                            {...register("cvv")}
                          />
                        </S.InputArea>
                        <S.InputArea
                          errorForm={
                            paymentChoice === "credit_card" &&
                            paymentFinished &&
                            choosedPortion === "" &&
                            true
                          }
                        >
                          <FormControl variant="standard">
                            <InputLabel id="demo-simple-select-standard-label">
                              Parcelas
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={choosedPortion}
                              label="Parcelas"
                              onChange={(e) =>
                                handleChoosedPortion(e.target.value)
                              }
                            >
                              {Object.values(
                                paymentsMethods.filter(
                                  (method) => method.method === "credit_card"
                                )[0].value
                              ).map((portions, index) => (
                                <MenuItem key={index} value={portions}>
                                  {`${index + 1}x ${currencyFormat(portions)} `}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </S.InputArea>

                        <S.TermsContainer>
                          <S.Terms
                            style={{
                              padding: "3px",
                            }}
                          >
                            <input
                              className="check-termos"
                              type="checkbox"
                              {...register("saveCard")}
                            />
                            Salvar cartão para futuras compras
                          </S.Terms>
                        </S.TermsContainer>
                      </span>
                    </S.Form>
                  )}
                </div>
              </S.ContainerPaymentMethods>
              <S.ContainerTotals>
                <div className="boxTotals">
                  <div className="labelTotal">Total</div>
                  <div className="total">{cart?.formated_grand_total}</div>
                </div>

                <button
                  type={
                    newCard && paymentChoice === "credit_card"
                      ? "submit"
                      : "button"
                  }
                  className="buttonPayment desk"
                  onClick={
                    newCard && paymentChoice === "credit_card"
                      ? () => setPaymentFinished(true)
                      : () => {
                          setPaymentFinished(true);
                          handlePayment();
                        }
                  }
                >
                  Finalizar Pagamento
                </button>
              </S.ContainerTotals>
              <S.WhiteContainer>
                <button
                  type={
                    newCard && paymentChoice === "credit_card"
                      ? "submit"
                      : "button"
                  }
                  className="buttonPayment mobile"
                  onClick={
                    newCard && paymentChoice === "credit_card"
                      ? () => setPaymentFinished(true)
                      : () => {
                          setPaymentFinished(true);
                          handlePayment();
                        }
                  }
                >
                  Finalizar Pagamento
                </button>
              </S.WhiteContainer>
            </S.ContainerGeneralPayment>
          </>
        )}
      </S.ContainerGeneral>
    </>
  );
};

export default Payment;
