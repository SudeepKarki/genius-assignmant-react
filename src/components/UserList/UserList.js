import React from "react";
import { useEffect, useState } from "react";
import "./UserList.scss";

import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";

function UserList() {
  const [userList, setUserList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [subscriptionList, setSubscriptionList] = useState([]);
  const [viewDetail, setViewDetail] = useState({ detail: {} });

  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await axios.get("./seed/users.json");
        setUserList(result.data);
        setFilteredUsers(result.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    const fetchSubscriptions = async () => {
      try {
        const result = await axios.get("./seed/subscriptions.json");
        setSubscriptionList(result.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchUsers();
    fetchSubscriptions();
  }, []);

  const viewSubscription = (id) => {
    let user = userList.find((x) => x.id == id);
    setViewDetail({
      ...user,
      detail: subscriptionList.find((x) => x.user_id == id),
    });
    const dialog = document.querySelector(".dialog-box");
    dialog.showModal();
  };

  const closeDialog = (evt) => {
    evt.target.closest("dialog").close();
  };

  const changeSearch = (evt) => {
    if (evt.keyCode != 13) return;
    let str = evt.target.value.toLowerCase();
    if (!str) {
      setFilteredUsers(userList);
      return;
    }
    let filtered = userList.filter(
      (user) =>
        user.username.toLowerCase().includes(str) ||
        user.first_name.toLowerCase().includes(str) ||
        user.middle_name.toLowerCase().includes(str) ||
        user.last_name.toLowerCase().includes(str) ||
        user.address.toLowerCase().includes(str) ||
        user.email.toLowerCase().includes(str) ||
        user.country.toLowerCase().includes(str)
    );
    setFilteredUsers(filtered);
  };
  const handleSortChange = (columnKey) => {
    console.log(columnKey);
    let order = "asc";
    if (sortColumn === columnKey && sortOrder === "asc") {
      order = "desc";
    }

    setSortColumn(columnKey);
    setSortOrder(order);
  };
  const sortedData = [...filteredUsers].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (a[sortColumn] > b[sortColumn]) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });
  return (
    <>
      <dialog className="dialog-box">
        <div className="table-responsive">
          <table className="table table-no-border">
            <tbody>
              <tr>
                <td>Username</td>
                <td>{viewDetail.username}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{viewDetail.email}</td>
              </tr>
              <tr>
                <td>Address</td>
                <td>{viewDetail.address}</td>
              </tr>
              <tr>
                <td>Country</td>
                <td>{viewDetail.country}</td>
              </tr>
              <tr>
                <td>Expires On</td>
                <td>
                  {/* {new Date(+viewDetail.detail?.expires_on)
                    .toISOString()
                    .substring(0, 10)} */}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="package-name">{viewDetail.detail?.package}</div>

        <button onClick={closeDialog} className="button-close">
          &times;
        </button>
      </dialog>
      <div className="search-box">
        <label>Search :</label>
        <input
          onKeyDown={changeSearch}
          type="search"
          placeholder="Press Enter to Search ..."
          className="search-input"
        />
      </div>
      <div className="table-responsive table-userlist">
        <table className="table">
          <thead>
            <tr>
              <th>S.N</th>
              <th>
                User Name
                <FontAwesomeIcon
                  icon={faSort}
                  onClick={() => handleSortChange("username")}
                />
              </th>
              <th>
                Full Name
                <FontAwesomeIcon
                  icon={faSort}
                  onClick={() => handleSortChange("first_name")}
                />
              </th>
              <th>
                Email
                <FontAwesomeIcon
                  icon={faSort}
                  onClick={() => handleSortChange("email")}
                />
              </th>
              <th>
                Address
                <FontAwesomeIcon
                  icon={faSort}
                  onClick={() => handleSortChange("address")}
                />
              </th>
              <th>
                Join Date
                <FontAwesomeIcon
                  icon={faSort}
                  onClick={() => handleSortChange("join_date")}
                />
              </th>
              <th>
                Status
                <FontAwesomeIcon
                  icon={faSort}
                  onClick={() => handleSortChange("active")}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((user, index) => (
              <tr key={user.id} onClick={() => viewSubscription(user.id)}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>
                  {user.first_name} {user.middle_name} {user.last_name}
                </td>
                <td>{user.email}</td>
                <td>
                  {user.address}, {user.country}
                </td>
                <td>
                  {new Date(+user.join_date).toISOString().substring(0, 10)}
                </td>
                <td>
                  <span
                    className={
                      user.active == "1"
                        ? "badge badge-success"
                        : "badge badge-danger"
                    }
                  >
                    {user.active == "1" ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UserList;
