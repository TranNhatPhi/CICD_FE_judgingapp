import { Helmet } from "react-helmet";

const APP_NAME = "judging-app";

const Meta = () => {
  return (
    <Helmet>
      <title>Judging App</title>
      <meta name="description" content="Judging App" />

      <meta name="application-name" content={APP_NAME} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={APP_NAME} />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#FFFFFF" />

      <link
        rel="shortcut icon"
        href="https://www.uow.edu.au/assets/logos/logo-svgs/logo-white.svg"
      ></link>
    </Helmet>
  );
};

export default Meta;
