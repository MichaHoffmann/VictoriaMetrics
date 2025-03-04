import React, { FC } from "react";
import EnhancedTable from "../Table/Table";
import TableCells from "../Table/TableCells/TableCells";
import { Data, HeadCell } from "../Table/types";
import { MutableRef } from "preact/hooks";
import Tabs from "../../../components/Main/Tabs/Tabs";
import { useMemo, useState } from "preact/compat";
import { ChartIcon, InfoIcon, TableIcon } from "../../../components/Main/Icons";
import "./style.scss";
import classNames from "classnames";
import useDeviceDetect from "../../../hooks/useDeviceDetect";
import Tooltip from "../../../components/Main/Tooltip/Tooltip";
import SimpleBarChart from "../../../components/Chart/SimpleBarChart/SimpleBarChart";

interface MetricsProperties {
  rows: Data[];
  onActionClick: (name: string) => void;
  tabs: string[];
  chartContainer: MutableRef<HTMLDivElement> | undefined;
  totalSeries: number,
  sectionTitle: string;
  tip?: string;
  tableHeaderCells: HeadCell[];
}

const MetricsContent: FC<MetricsProperties> = ({
  rows,
  tabs: tabsProps = [],
  chartContainer,
  totalSeries,
  onActionClick,
  sectionTitle,
  tip,
  tableHeaderCells,
}) => {
  const { isMobile } = useDeviceDetect();
  const [activeTab, setActiveTab] = useState("table");

  const tableCells = (row: Data) => (
    <TableCells
      row={row}
      totalSeries={totalSeries}
      onActionClick={onActionClick}
    />
  );

  const tabs = useMemo(() => tabsProps.map((t, i) => ({
    value: t,
    label: t,
    icon: i === 0 ? <TableIcon /> : <ChartIcon />
  })), [tabsProps]);

  return (
    <div
      className={classNames({
        "vm-metrics-content": true,
        "vm-metrics-content_mobile": isMobile,
        "vm-block": true,
        "vm-block_mobile": isMobile,
      })}
    >
      <div className="vm-metrics-content-header vm-section-header">
        <h5
          className={classNames({
            "vm-metrics-content-header__title": true,
            "vm-section-header__title": true,
            "vm-section-header__title_mobile": isMobile,
          })}
        >
          {!isMobile && tip && (
            <Tooltip
              title={<p
                dangerouslySetInnerHTML={{ __html: tip }}
                className="vm-metrics-content-header__tip"
              />}
            >
              <div className="vm-metrics-content-header__tip-icon"><InfoIcon/></div>
            </Tooltip>
          )}
          {sectionTitle}
        </h5>
        <div className="vm-section-header__tabs">
          <Tabs
            activeItem={activeTab}
            items={tabs}
            onChange={setActiveTab}
          />
        </div>
      </div>

      {activeTab === "table" && (
        <div
          ref={chartContainer}
          className={classNames({
            "vm-metrics-content__table": true,
            "vm-metrics-content__table_mobile": isMobile
          })}
        >
          <EnhancedTable
            rows={rows}
            headerCells={tableHeaderCells}
            defaultSortColumn={"value"}
            tableCells={tableCells}
          />
        </div>
      )}
      {activeTab === "graph" && (
        <div className="vm-metrics-content__chart">
          <SimpleBarChart data={rows.map(({ name, value }) => ({ name, value }))}/>
        </div>
      )}
    </div>
  );
};

export default MetricsContent;
