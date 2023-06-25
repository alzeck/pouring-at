import { ClerkProvider } from "@clerk/nextjs";
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/700.css";
import { type AppType } from "next/app";
import Head from "next/head";
import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Pouring at</title>
        <meta
          name="description"
          content="Find your favourite and best beers near you"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ClerkProvider {...pageProps}>
        <div className="min-h-screen">
          <Header />
          <Component {...pageProps} />
          <Footer />
        </div>
      </ClerkProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
