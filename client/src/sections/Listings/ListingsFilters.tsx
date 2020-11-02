import React from "react";
import { ListingsFilter } from "../../lib/graphql/globalTypes";
import { Select } from "antd";

interface ListingsFiltersProps {
  filter: ListingsFilter;
  setFilter: (filter: ListingsFilter) => void;
}

const { Option } = Select;

export const ListingsFilters = ({
  filter,
  setFilter,
}: ListingsFiltersProps) => {
  return (
    <div className="listings-filters">
      <span>Filter By</span>
      <Select
        value={filter}
        onChange={(filter: ListingsFilter) => setFilter(filter)}
      >
        <Option value={ListingsFilter.PRICE_LOW_TO_HIGH}>
          Price: Low to High
        </Option>
        <Option value={ListingsFilter.PRICE_HIGH_TO_LOW}>
          Price: High to Low
        </Option>
      </Select>
    </div>
  );
};
