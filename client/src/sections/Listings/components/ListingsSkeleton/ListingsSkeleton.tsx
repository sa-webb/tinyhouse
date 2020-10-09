import React from "react";
import { Alert, Divider, Skeleton } from "antd";

import "./styles/ListingsSkeleton.css";

interface IProps {
  title: string;
  error?: boolean;
}

export const ListingsSkeleton: React.FC<IProps> = ({
  title,
  error = false,
}) => {
  const errorAlert = error ? (
    <Alert type="error" message="Uh oh! Something went wrong" className="listings-skeleton__alert"/>
  ) : null;
  return (
    <div className="listings-skeleton">
      {errorAlert}
      <h2>{title}</h2>
      <Skeleton active paragraph={{ rows: 1 }} />
      <Divider />
      <Skeleton active paragraph={{ rows: 1 }} />
      <Divider />
      <Skeleton active paragraph={{ rows: 1 }} />
    </div>
  );
};
