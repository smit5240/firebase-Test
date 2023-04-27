import React, { useEffect, useState } from "react";
import firebase, { db } from "../Firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Transition } from "react-transition-group";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import Spinner from "./Spinner";
import { getAuth } from "firebase/auth";
export default function Home() {
  const [userdata, setUserdata] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = useState([]);
  const [authicatedUser, setAuthicatedUser] = useState("");
  const [isShow, setIsShow] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  useEffect(() => {
    setIsShow(true);
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
      });
    setAuthicatedUser(localStorage.getItem("email"));
  };
  const deleteuser = async () => {
    setIsShow(true);
    try {
      const user = auth.currentUser;
      if (user) {
        user
          .delete()
          .then(async () => {
            await deleteDoc(doc(db, "USERS", localStorage.getItem("uid")))
              .then((res) => {
                getdata();
              })
              .catch((error) => {
                window.alert(error);
              });
          })
          .catch((error) => {
            window.alert(error);
          });
      }
    } catch (error) {}
  };
  const updateuser = async (e) => {
    e.preventDefault();
    setOpen(false);
    const { name, email, address } = user;
    firebase
      .firestore()
      .collection("USERS")
      .doc(localStorage.getItem("uid"))
      .set(
        {
          user: {
            name: name,
            email: email,
            address: address,
          },
        },
        { merge: true }
      );
    getdata();
  };
  const handlechange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const openmodel = async (item) => {
    setOpen(true);
    setUser({
      name: item.name,
      email: item.email,
      address: item.address,
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
              <ul
                className="grid grid-cols-12 bg-[#1e2a42] text-[#fff]"
                key={i}
              >
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
                {authicatedUser === item.email && (
                  <li className="col-span-1 flex justify-center items-center font-[700] p-2">
                    <i
                      className="fa-regular fa-pen-to-square pe-2 text-[#0558ff] cursor-pointer"
                      onClick={() => openmodel(item)}
                    ></i>
                    <span className="ps-2">
                      <i
                        className="fa-regular fa-trash-can text-[#ff0505] cursor-pointer"
                        onClick={() => deleteuser()}
                      ></i>
                    </span>
                  </li>
                )}
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
                              htmlFor="confirm-password"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={user?.name}
                              onChange={handlechange}
                              id="name"
                              placeholder=""
                              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              required=""
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="confirm-password"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Address
                            </label>
                            <input
                              type="text"
                              name="address"
                              value={user?.address}
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
                            Update
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
