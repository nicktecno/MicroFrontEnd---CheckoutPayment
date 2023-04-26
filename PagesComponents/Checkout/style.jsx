import styled from "styled-components";

import { Check } from "@styled-icons/boxicons-regular/Check";
import { CheckSquare } from "@styled-icons/boxicons-regular/CheckSquare";

import { MdCreditCard } from "react-icons/md";
import { Barcode } from "@styled-icons/ionicons-sharp/Barcode";
import { generateMedia } from "styled-media-query";
import { BoxOpen } from "@styled-icons/fa-solid/BoxOpen";

const customMedia = generateMedia({
  desktop: "1200px",
  notebook: "991px",
  tablet: "768px",
  mobile: "576px",
});

export const PackageIcon = styled(BoxOpen)`
  color: var(--default-color);
  height: 110px;
  width: 110px;
  margin-bottom: 50px;
  cursor: pointer;
`;

export const CreditIcon = styled(MdCreditCard)`
  color: #292728;
  height: 50px;
  width: 50px;
  min-width: 30px;
  margin-right: 30%;
  cursor: pointer;
`;

export const BarIcon = styled(Barcode)`
  color: #292728;
  height: 50px;
  width: 50px;
  margin-right: 30%;
  min-width: 30px;
  cursor: pointer;
`;

export const CheckIcon = styled(CheckSquare)`
  color: #ce171f;
  height: 24px;
  width: 24px;
  margin-right: 0px;
  cursor: pointer;
`;

export const CloseIcon = styled(Check)`
  color: #444;
  height: 24px;
  width: 24px;
  margin-right: 0px;
  cursor: pointer;
`;

export const Breadcrumb = styled.div`
  width: 100%;
  height: 65px;
  margin-bottom: 40px;
  position: relative;
  max-width: 1920px;

  color: black;
  padding-top: 40px;

  span {
    font-weight: bold;
  }

  a {
    color: #292728;
    transition: 0.3s;
  }
`;

export const ContainerAnimation = styled.div`
  display: flex;
  width: 100%;

  justify-content: center;
`;

export const ContainerLoading = styled.div`
  display: flex;

  img {
    width: 150px;
  }
`;

export const ContainerGeneral = styled.div`
  height: 100%;

  flex-direction: column;
  padding: 0px 12%;
  display: flex;
  width: 100%;
  position: relative;

  align-items: center;
  align-self: center;

  ${customMedia.lessThan("1366px")`
    padding: 0px 5%;
  `}

  ${customMedia.lessThan("tablet")`
    padding:0px 20px;
  `}

.title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: flex-start;

    display: flex;
    width: 100%;
    max-width: 1920px;
  }

  .buttonPayment {
    display: flex;
    text-align: center;
    justify-content: center;
    width: 300px;
    font-size: 16px;

    padding: 15px 10px;
    font-weight: bold;
    border-radius: 2px;
    cursor: pointer;
    color: var(--bt-purchase-text-color);
    background-color: var(--bt-purchase-color);
    transition: 0.3s;
    border: 0px;

    :hover {
      background-color: var(--bt-purchase-color-hover);
    }

    ${customMedia.lessThan("tablet")`
    &.desk{
      display:none;
    }
  `}
  }
`;

export const ContainerGeneralPayment = styled.form`
  display: flex;
  width: 100%;
  justify-content: space-between;
  max-width: 1920px;

  ${customMedia.lessThan("tablet")`
    flex-direction:column;
    justify-content:center;
  `}
`;

export const ContainerPaymentMethods = styled.div`
  display: flex;
  width: 60%;
  flex-direction: column;

  ${customMedia.lessThan("notebook")`
     width:50%;
  `}

  ${customMedia.lessThan("tablet")`
    width:100%;
    justify-content:center;
  `}

  .containerMethods {
    margin-top: 10px;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
    margin-bottom: 10px;
  }

  .containerMethodChoosed {
    display: flex;
    max-width: 600px;
    align-self: center;
    flex-direction: column;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 20px;

    .containerBillet {
      font-size: 16px;
      text-align: center;
      align-self: center;
      display: flex;
      flex-direction: column;

      animation: fadeOnly 500ms forwards;

      @keyframes fadeOnly {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 100;
        }
      }
    }

    .css-1sumxir-MuiFormLabel-root-MuiInputLabel-root.Mui-focused {
      color: black;
    }

    label {
      font-weight: bold;
      font-size: 16px;
    }

    .containerToggle {
      justify-content: center;
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      animation: fadeOnly 500ms forwards;

      @keyframes fadeOnly {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 100;
        }
      }
      .toggleNewCard {
        display: flex;
        font-weight: bold;
        font-size: 18px;
        margin-right: 10px;
      }
    }
  }

  .containerSelectsNewCard {
    display: flex;
    flex-direction: column;
    animation: fadeOnly 500ms forwards;
    gap: 20px;

    @keyframes fadeOnly {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 100;
      }
    }
  }

  .card {
    width: 30%;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    min-height: 100px;
    max-height: 100px;
    box-shadow: var(--box-shadow);
    background-color: var(--payment-method-card);
    border-radius: 2px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 0.3s;
    flex-wrap: wrap;
    padding: 5px;

    &.selected {
      background-color: var(--default-color);
    }

    :hover {
      background-color: var(--default-color-hover);
    }

    .name {
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 10px;
      text-align: center;
    }

    .image {
      width: 35px;
    }
  }
`;

export const ContainerTotals = styled.div`
  display: flex;
  width: 30%;
  padding: 5px;
  align-items: flex-end;
  flex-direction: column;

  ${customMedia.lessThan("tablet")`
    width:100%;
    align-items:center;
  `}

  .boxTotals {
    display: flex;
    flex-direction: column;
    box-shadow: var(--box-shadow);
    justify-content: center;
    align-items: center;
    padding: 10px;
    width: 300px;
    min-height: 150px;
    border-radius: 2px;
    margin-bottom: 10px;
    ${customMedia.lessThan("tablet")`
    width:100%;
    
  `}

    .labelTotal {
      margin-bottom: 10px;
    }
    .total {
      font-size: 20px;
      font-weight: bold;
    }
  }
`;

export const WhiteContainer = styled.div`
  display: none;

  ${customMedia.lessThan("tablet")`
      z-index:7;
	    display: flex;
		    align-items: center;
		    justify-content:center;
            width: 100%;
            
            background-color: #fff;
            position: fixed;
      	    
		bottom: 80px;
height: 61px;
		`}
`;

export const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  width: 100%;

  label {
    color: #292929 !important;
  }

  #demo-simple-select-standard {
    padding-left: 10px;
  }

  #demo-simple-select-standard-label {
    padding-left: 10px;
  }

  .css-a3l6o-MuiInputBase-root-MuiInput-root-MuiSelect-root:after {
    border-bottom: black;
  }

  #demo-simple-select-standard-label {
    &.MuiInputLabel-shrink {
      font-size: 20px;
    }
    padding-left: ${(props) => (props.errorForm ? "10px" : "0px")};
  }

  .MuiInput-root {
    border: ${(props) =>
      props.errorForm ? "2px solid #ce171f" : "2px solid transparent"};
  }

  input {
    border: 0px;
    border-bottom: 2px solid #ccc;
  }
  label {
    text-align: left;
    margin-bottom: 0px;
  }
  #radioLabel {
    display: flex;

    input {
      width: 20px;
      height: 20px;
      margin: 0 10px;
    }
  }
`;

export const Form = styled.div`
  width: 100%;

  animation: fadeOnly 500ms forwards;

  @keyframes fadeOnly {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 100;
    }
  }
  span {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  span label {
    font-size: 16px;
    font-weight: bold;
    align-self: flex-start;
  }

  span input {
    width: 100%;
    margin-top: 5px;
    padding-left: 10px;
    font-size: 14px;
    height: 40px;
    border-radius: 2px;

    padding-bottom: 4px;
    transition: 0.3s;

    :hover {
      border-bottom: solid 2px var(--input-border-color-hover);
    }
  }

  span input::placeholder {
    font-size: 14px;
  }

  .check-termos {
    height: initial;
    width: initial;
    margin-right: 10px;
    position: relative;
    top: 2px;
    margin-bottom: 5px;
  }
`;

export const TermsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

export const Terms = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #000000;
  margin-bottom: 10px;
  padding: 2px;
  border: ${(props) =>
    props.alert ? "2px solid #ce171f" : "2px solid transparent"};
  font-weight: 600;
  .check-termos {
    all: unset;
    border: 1px solid black;
    width: 15px;
    height: 15px;
    display: inline-block;
    cursor: pointer;
    margin-right: 5px;
    :hover {
      border: 1px solid black;
    }
  }
  .check-termos:checked {
    width: 15px;
    height: 15px;
    background-color: var(--default-color);
    color: #292728;
    &:before {
      content: "✔️";
      color: #292728;
      display: flex;
      font-size: 12px;
    }
  }
`;
