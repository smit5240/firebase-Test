import React, { useEffect, useState } from "react";
import firebase, { db } from "../Firebase";
import { getDatabase, ref, set } from "firebase/database";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Transition } from "react-transition-group";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import Spinner from "./Spinner";
export default function Home() {
  const [userdata, setUserdata] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = useState([]);
  const [userid, setUserid] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [isShowdata, setIsShowdata] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    setIsShow(true);
    setIsShowdata(false);
    getdata();
    let token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  const getdata = () => {
    firebase
      .firestore()
      .collection("USERS")
      .get()
      .then((que) => {
        const temp = [];
        que.forEach((data) => {
          let manage = data.data();
          temp.push(manage.user);
        });
        setUserdata(temp);
        setIsShow(false);
        setIsShowdata(true);
      });
  };

  const deleteuser = async (item) => {
    setIsShow(true);
    setIsShowdata(false);
    await firebase
      .firestore()
      .collection("USERS")
      .where("user.email", "==", item.email)
      .get(1)
      .then((que) => {
        que.forEach((data) => {
          data.data();
          setUserid(data.id);
        });
      })
      .catch((err) => {
        window.alert(err);
      });
    await deleteDoc(doc(db, "USERS", userid))
      .then((res) => {
        getdata();
      })
      .catch((error) => {
        window.alert(error);
      });
  };

  const updateuser = async (e) => {
    e.preventDefault();
    const { name, email, address } = user;
    const db = getDatabase();
    const doc = set(ref(db, "USERS/" + userid), {
      name: name,
      email: email,
      address: address,
    })
      .then((res) => {
        console.log("res --->", res);
      })
      .catch((error) => {
        console.log("error --->", error);
      });
    console.log("Doc --->", doc);
  };

  const handlechange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const openmodel = async (item) => {
    setUser({ name: "", email: "", address: "" });
    setOpen(true);
    await firebase
      .firestore()
      .collection("USERS")
      .where("user.email", "==", item.email)
      .get(1)
      .then((que) => {
        que.docs.forEach((data) => {
          data.data();
          setUserid(data.id);
        });
      })
      .catch((err) => {
        console.log("Error ------>", err);
      });
  };

  return (
    <div className="md:mx-[10%] my-14">
      {isShow === "true" && <Spinner />}
      <div>
        <ul className="grid grid-cols-12 bg-[#111827] text-[#fff]">
          <li className="col-span-1 flex justify-center font-[700] p-2">No.</li>
          <li className="col-span-3 flex justify-center font-[700] p-2">
            Name
          </li>
          <li className="col-span-4 flex justify-center font-[700] p-2">
            Email
          </li>
          <li className="col-span-3 flex justify-center font-[700] p-2">
            Address
          </li>
          <li className="col-span-1 flex justify-center font-[700] p-2"></li>
        </ul>
        {userdata &&
          userdata.map((item, i) => {
            return (
              <ul className="grid grid-cols-12 bg-[#1e2a42] text-[#fff]">
                <li className="col-span-1 flex justify-center  p-3">{i + 1}</li>
                <li className="col-span-3 flex justify-center  p-3">
                  {item?.name}
                </li>
                <li className="col-span-4 flex justify-center  p-3">
                  {item?.email}
                </li>
                <li className="col-span-3 flex justify-center  p-3">
                  {item?.address}
                </li>
                <li className="col-span-1 flex justify-center items-center font-[700] p-2">
                  <i
                    className="fa-regular fa-pen-to-square pe-2 text-[#0558ff] cursor-pointer"
                    onClick={() => openmodel(item)}
                  ></i>
                  <span className="ps-2">
                    <i
                      className="fa-regular fa-trash-can text-[#ff0505] cursor-pointer"
                      onClick={() => deleteuser(item)}
                    ></i>
                  </span>
                </li>
              </ul>
            );
          })}
      </div>
      <React.Fragment>
        <Transition in={open} timeout={400}>
          {(state) => (
            <Modal
              keepMounted
              open={!["exited", "exiting"].includes(state)}
              onClose={() => setOpen(false)}
              slotProps={{
                backdrop: {
                  sx: {
                    opacity: 0,
                    backdropFilter: "none",
                    transition: `opacity 400ms, backdrop-filter 400ms`,
                    ...{
                      entering: { opacity: 1, backdropFilter: "blur(5px)" },
                      entered: { opacity: 1, backdropFilter: "blur(5px)" },
                    }[state],
                  },
                },
              }}
              sx={{
                visibility: state === "exited" ? "hidden" : "visible",
              }}
            >
              <ModalDialog
                aria-labelledby="fade-modal-dialog-title"
                aria-describedby="fade-modal-dialog-description"
                sx={{
                  opacity: 0,
                  transition: `opacity 300ms`,
                  ...{
                    entering: { opacity: 1 },
                    entered: { opacity: 1 },
                  }[state],
                }}
              >
                <Typography id="fade-modal-dialog-title" component="h2">
                  <h1 className="text-[32px] font-[600] flex justify-center">
                    Edit Data
                  </h1>
                </Typography>
                <Typography
                  id="fade-modal-dialog-description"
                  textColor="text.tertiary"
                >
                  <div className="flex flex-col items-center justify-center  mx-auto  lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <form className="space-y-4 md:space-y-6">
                          <div>
                            <label
                              for="confirm-password"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={user.name}
                              onChange={handlechange}
                              id="name"
                              placeholder=""
                              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              required=""
                            />
                          </div>
                          <div>
                            <label
                              for="email"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Your email
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={user.email}
                              onChange={handlechange}
                              id="email"
                              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder=""
                              required=""
                            />
                          </div>
                          <div>
                            <label
                              for="confirm-password"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Address
                            </label>
                            <input
                              type="text"
                              name="address"
                              value={user.address}
                              onChange={handlechange}
                              id="confirm-password"
                              placeholder=""
                              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              required=""
                            />
                          </div>

                          <button
                            onClick={(e) => updateuser(e)}
                            className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                          >
                            Update Data
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </Typography>
              </ModalDialog>
            </Modal>
          )}
        </Transition>
      </React.Fragment>
    </div>
  );
}
