import AuthForm from "@/Components/AuthForm";
import Head from "next/head";

export default function AuthPage() {
  return (
    <>
      <Head>
        <title>Join The Team</title>
        <meta 
          name="description" 
          content="Secure login and registration for Mighty Strikers. Access your dashboard to get touched with us." 
        />
        <meta 
          name="keywords" 
          content="login, sign up, authentication, account, secure login, register, access account, join mighty strikers, dashboard" 
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Sign In | Mighty Strikers" />
        <meta 
          property="og:description" 
          content="Secure authentication for MIghty Strikers. Login or create an account." 
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mighty-strikers.vercel.app//auth-form" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Sign In | Mighty Strikers" />
        <meta 
          name="twitter:description" 
          content="Secure login and registration for MIghty Strikers" 
        />
        <link rel="canonical" href="https://mighty-strikers.vercel.app//auth-form" />
      </Head>
      
      <main role="main">
        <AuthForm />
      </main>
    </>
  );
}