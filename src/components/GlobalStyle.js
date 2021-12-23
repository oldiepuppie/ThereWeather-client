import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --page-bg-color: #fafafa;
    --mobile-header-color: #a2d2ff;
    --button-bg-normal: #ddd;
    --button-bg-positive: #419300;
    --button-bg-negative: #ff4545;
    --font-validation-negative: #e04f4f;
    --font-validation-positive: #327552;
    --button-bg-edit: #2f6ecb;
    --button-bg-google: #ea4335;
    --modal-bg-color: #00000066;
    --modal-confirm-bg: #f2f2f2;
    --modal-confirm-button-bg: #c4c4c4;

    --mobile-page-height: calc(100vh - 125px);
    --mobile-header-height: 200px;
    --mobile-menubar-height: 70px;

    --desktop-page-height: calc(100vh - 125px);
    --desktop-header-height: 125px;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  button {
    border-radius: none;
    border: none;
    background-color: transparent;
    cursor: pointer;
  }

  @keyframes add-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export default GlobalStyle;
