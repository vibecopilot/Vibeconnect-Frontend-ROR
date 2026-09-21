import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "../../components/Navbar";
import Communication from "../Communication";
import CreateGroup from "./CreateGroup";
import SiteHeader from "../../components/SiteHeader";

import { PiPlusCircle } from "react-icons/pi";
import { getGroups, domainPrefix } from "../../api";
import { dateFormatSTD } from "../../utils/dateUtils";
import { DNA } from "react-loader-spinner";

function Groups() {
  const themeColor = useSelector((state) => state.theme.color);

  const [createModal, setCreateModal] = useState(false);

  const [groupData, setGroupData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    try {
      setLoading(true);

      const res = await getGroups();

      const sortedGroups = res.data.sort((a, b) => {
        return (
          new Date(b.created_at) -
          new Date(a.created_at)
        );
      });

      setGroupData(sortedGroups);
      setFilteredData(sortedGroups);

      console.log(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  function truncateWithEllipses(
    text,
    maxLength = 100
  ) {
    if (!text) return "";

    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  }

  const colors = [
    "bg-red-100",
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-purple-100",
  ];

  const handleSearch = (e) => {
    const searchValue = e.target.value;

    setSearchText(searchValue);

    if (searchValue.trim() === "") {
      setFilteredData(groupData);
    } else {
      const filteredResult = groupData.filter(
        (group) =>
          group.group_name
            ?.toLowerCase()
            .includes(
              searchValue.trim().toLowerCase()
            )
      );

      setFilteredData(filteredResult);
    }
  };

  return (
    <section className="flex">
      <Navbar />

      <div className="p-2 w-full  flex md:mx-2 overflow-hidden flex-col">
        {/* Site Change Header */}
        <SiteHeader onSiteChange={fetchGroups} />

        <Communication />

        {/* Search + Create */}
        <div className="grid grid-cols-12 my-2 gap-3">
          <input
            type="text"
            placeholder="Search by group name"
            className="border p-2 w-full border-gray-300 rounded-lg col-span-10"
            value={searchText}
            onChange={handleSearch}
          />

          <button
            onClick={() => setCreateModal(true)}
            style={{ background: themeColor }}
            className="font-semibold text-white px-4 p-2 justify-center flex items-center gap-2 rounded-md col-span-2"
          >
            <PiPlusCircle size={20} />
            Create
          </button>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center mt-10 h-60">
            <DNA
              visible={true}
              height={120}
              width={130}
            />
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {filteredData?.length > 0 ? (
                filteredData.map((group) => (
                  <Link
                    to={`/admin/communication-group-details/${group?.id}`}
                    key={group?.id}
                  >
                    <div className="flex flex-col justify-between my-3 w-96 max-h-96 min-h-96">
                      <div className="border flex flex-col justify-between border-gray-100 rounded-xl bg-blue-50 hover:bg-blue-100 min-h-96 shadow-custom-all-sides transition-all duration-200 ease-in-out">

                        {/* Cover Image */}
                        {group.cover_image &&
                          group.cover_image.length >
                          0 && (
                            <img
                              src={
                                group.cover_image?.[0]
                                  ?.document_url
                                  ? /^https?:\/\//i.test(
                                    group
                                      .cover_image[0]
                                      .document_url
                                  )
                                    ? group
                                      .cover_image[0]
                                      .document_url
                                    : domainPrefix +
                                    group
                                      .cover_image[0]
                                      .document_url
                                  : ""
                              }
                              className="w-full h-48 object-cover rounded-t-xl"
                              alt="group-cover"
                            />
                          )}

                        {/* Content */}
                        <div className="m-3 flex flex-col gap-3 flex-1">
                          {/* Title + Date */}
                          <div className="flex justify-between items-start gap-2">
                            <h2 className="text-lg font-semibold break-words">
                              {group?.group_name}
                            </h2>

                            <p className="text-sm text-gray-500 whitespace-nowrap">
                              {dateFormatSTD(
                                group?.created_at
                              )}
                            </p>
                          </div>

                          {/* Members Count */}
                          <div className="flex gap-2 items-center">
                            <p className="text-gray-500">
                              Members :
                            </p>

                            <h2 className="text-gray-700 font-medium">
                              {
                                group?.group_members
                                  ?.length
                              }
                            </h2>
                          </div>

                          {/* Description */}
                          <div>
                            <p className="text-gray-500 text-sm">
                              {truncateWithEllipses(
                                group?.group_description
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Members Avatar */}
                        <div className="flex items-center justify-between m-3">
                          <div className="flex items-center gap-1 flex-wrap">
                            {group.group_members
                              ?.slice(0, 5)
                              .map(
                                (
                                  member,
                                  index
                                ) => (
                                  <div
                                    key={index}
                                    className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md ${colors[
                                      index %
                                      colors.length
                                    ]
                                      } text-gray-800 font-medium text-lg`}
                                  >
                                    {member?.user_name
                                      ? member.user_name[0].toUpperCase()
                                      : "?"}
                                  </div>
                                )
                              )}

                            {group?.group_members
                              ?.length > 5 && (
                                <div className="w-10 h-10 flex items-center justify-center border border-gray-300 bg-gray-200 text-gray-800 font-medium text-lg rounded-md">
                                  +
                                  {group
                                    ?.group_members
                                    ?.length - 5}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex justify-center items-center h-40 w-full">
                  <p className="text-gray-500 text-center">
                    No Groups Found
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {createModal && (
        <CreateGroup
          onclose={() =>
            setCreateModal(false)
          }
        />
      )}
    </section>
  );
}

export default Groups;