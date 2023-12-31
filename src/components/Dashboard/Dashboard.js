import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCheck,
  faUsers,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";

import {
  // Line Chart
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  // Pie Chart
  PieChart,
  Pie,
  Sector,
} from "recharts";

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

function Dashboard() {
  const [userList, setUserList] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await axios.get("./seed/users.json");
        setUserList(result.data);
        let data = result.data.map((x) => ({
          ...x,
          date: new Date(+x.join_date).toISOString().substring(0, 10),
        }));
        let obj = Object.groupBy(data, ({ date }) => date);
        setLineData(
          Object.keys(obj)
            .toSorted()
            .map((x) => ({
              date: x,
              user: obj[x].length,
            }))
        );
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    const fetchSubscriptions = async () => {
      try {
        const result = await axios.get("./seed/subscriptions.json");
        let obj = Object.groupBy(result.data, (x) => x.package);
        setPieData(
          Object.keys(obj)
            .toSorted()
            .map((x) => ({
              name: x,
              value: obj[x].length,
            }))
        );
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchUsers();
    fetchSubscriptions();
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  return (
    <>
      <div className="dashboard-card">
        <div className="card card--bg-red">
          <h2>
            Total Users <FontAwesomeIcon icon={faUsers} />
          </h2>
          <h3>{userList.length}</h3>
        </div>
        <div className="card card--bg-blue">
          <h2>
            Active Users <FontAwesomeIcon icon={faUserCheck} />
          </h2>
          <h3>{userList.filter((user) => user.active == "1").length}</h3>
        </div>
        <div className="card card--bg-green">
          <h2>
            Total Countries <FontAwesomeIcon icon={faFlag} />
          </h2>
          <h3>{[...new Set(userList.map((user) => user.country))].length}</h3>
        </div>
      </div>
      <div className="dashboard-charts">
        <div className="card">
          <h2 className="card-title">Users</h2>
          <LineChart
            width={1004}
            height={300}
            data={lineData}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <Line type="monotone" dataKey="user" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </div>
        <div className="card">
          <h2 className="card-title">Plans</h2>

          <PieChart width={400} height={400}>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={pieData}
              cx={200}
              cy={200}
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
            />
          </PieChart>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
