import { useQuery } from "@apollo/client";
import { Affix, Layout, List, Typography } from "antd";
import React, { useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { ErrorBanner } from "../../lib/components/ErrorBanner";
import { ListingCard } from "../../lib/components/ListingCard";
import { ListingsFilter } from "../../lib/graphql/globalTypes";
import { LISTINGS } from "../../lib/graphql/queries/Listings";
import {
  Listings as ListingsData,
  ListingsVariables,
} from "../../lib/graphql/queries/Listings/__generated__/Listings";
import { ListingsFilters } from "./ListingsFilters";
import { ListingsPagination } from "./ListingsPagination";
import { ListingsSkeleton } from "./ListingsSkeleton";

const PAGE_LIMIT = 8;

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

interface MatchParams {
  location: string;
}

export const Listings = ({ match }: RouteComponentProps<MatchParams>) => {
  const [filter, setFilter] = useState(ListingsFilter.PRICE_LOW_TO_HIGH);
  const [page, setPage] = useState(1);
  const { data, loading, error } = useQuery<ListingsData, ListingsVariables>(
    LISTINGS,
    {
      variables: {
        location: match.params.location,
        filter,
        limit: PAGE_LIMIT,
        page: 1,
      },
    }
  );

  if (loading) {
    return (
      <Content className="listings">
        <ListingsSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="listings">
        <ErrorBanner
          description={`
            We either couldn't find anything matching your search or have encountered an error.
            If you're searching for a unique location, try searching again with more common keywords.
          `}
        />
        <ListingsSkeleton />
      </Content>
    );
  }

  const listings = data ? data.listings : null;
  const listingsRegion = listings ? listings.region : null;

  const listingsSectionElement =
    listings && listings.result.length ? (
      <div>
        <Affix offsetTop={64}>
          <ListingsPagination
            total={listings.total}
            page={page}
            limit={PAGE_LIMIT}
            setPage={setPage}
          />
          <ListingsFilters filter={filter} setFilter={setFilter} />
        </Affix>
        <List
          grid={{
            gutter: 8,
            xs: 1,
            sm: 2,
            lg: 4,
          }}
          dataSource={listings.result}
          renderItem={(listing) => (
            <List.Item>
              <ListingCard listing={listing} />
            </List.Item>
          )}
        />
      </div>
    ) : (
      <div>
        <Paragraph>
          It appears that no listings have yet been created for{" "}
          <Text mark>"{listingsRegion}"</Text>
        </Paragraph>
        <Paragraph>
          Be the first person to create a{" "}
          <Link to="/host">listing in this area</Link>!
        </Paragraph>
      </div>
    );

  const listingsRegionElement = listingsRegion ? (
    <Title level={3} className="listings__title">
      Results for "{listingsRegion}"
    </Title>
  ) : null;

  return (
    <Content className="listings">
      {listingsRegionElement}
      {listingsSectionElement}
    </Content>
  );
};
