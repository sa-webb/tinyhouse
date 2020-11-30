import React, { useEffect, useRef } from "react";
import { Card, Layout, Spin, Typography } from "antd";

import googleLogo from "../assets/google_logo.jpg";
import { Viewer } from "../lib/types";
import { useApolloClient, useMutation } from "@apollo/client";

import { AuthUrl as AuthUrlData } from "../lib/graphql/queries/AuthURL/__generated__/AuthUrl";
import { AUTH_URL } from "../lib/graphql/queries/AuthURL";

import {
  LogIn as LogInData,
  LogInVariables,
} from "../lib/graphql/mutations/Login/__generated__/LogIn";
import { LOG_IN } from "../lib/graphql/mutations/Login";
import { displayErrorMessage, displaySuccessNotification } from "../lib/utils";
import { ErrorBanner } from "../lib/components/ErrorBanner";
import { Redirect } from "react-router-dom";
import { useScrollToTop } from "../lib/hooks/useScrollToTop";

const { Content } = Layout;
const { Text, Title } = Typography;

interface Props {
  setViewer: (viewer: Viewer) => void;
}

export const Login = ({ setViewer }: Props) => {
  const client = useApolloClient();
  const [
    logIn,
    { data: logInData, loading: logInLoading, error: logInError },
  ] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn && data.logIn.token) {
        setViewer(data.logIn);
        sessionStorage.setItem("token", data.logIn.token);
        displaySuccessNotification("You have successfully logged in");
      }
    },
  });

  useScrollToTop();

  // logInRef.current property will reference the original function regardless of how many renders happen again
  // this function reference is going to remain the same regardless of rerenders
  const logInRef = useRef(logIn);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      logInRef.current({
        variables: {
          input: { code },
        },
      });
    }
  }, []);

  const handleAuthorize = async () => {
    try {
      const { data } = await client.query<AuthUrlData>({
        query: AUTH_URL,
      });
      // open authUrl returned from Google
      window.location.href = data.authUrl;
    } catch (error) {
      displayErrorMessage(
        "Sorry! We were unable to log you in. Please try again later!"
      );
    }
  };

  if (logInLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Logging you in..." />
      </Content>
    );
  }

  if (logInData && logInData.logIn) {
    const { id: viewerId } = logInData.logIn;
    return <Redirect to={`/user/${viewerId}`} />;
  }

  const logInErrorBannerElement = logInError ? (
    <ErrorBanner description="We weren't able to log you in. Please try again soon." />
  ) : null;

  return (
    <Content className="log-in">
      {logInErrorBannerElement}
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              👋
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Log in to TinyHouse!
          </Title>
          <Text>Sign in with Google to start booking available rentals!</Text>
        </div>
        <button
          className="log-in-card__google-button"
          onClick={handleAuthorize}
        >
          <img
            src={googleLogo}
            alt="Google Logo"
            className="log-in-card__google-button-logo"
          />
          <span className="log-in-card__google-button-text">
            Sign in with Google
          </span>
        </button>
        <Text type="secondary">
          Note: By signing in, you'll be redirected to the Google consent form
          to sign in with your Google account.
        </Text>
      </Card>
    </Content>
  );
};
