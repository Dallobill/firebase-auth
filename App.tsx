// Import necessary hooks and functions from React and Firebase libraries
import { useState, Dispatch, SetStateAction } from "react";
import {
  getAuth,                          // Tool to manage user account
  createUserWithEmailAndPassword,   // Tool to create a new user with an email and password
  signInWithEmailAndPassword,       // Tool to sign in a existing user with email and password
  UserCredential,                   // Info about the user that log in
} from "firebase/auth";

// This is the main function that runs my app
export default function App(){
  // This is where we keep track of the logged-in user (starting as no user: null)
  const [user, setUser] = useState<UserCredential | null>(null);

  // If a user is logged in, show their info on the screen
  if (user) {
    return <div>{JSON.stringify(user)}</div>;
  }

  // I a user is logged in, show the login/signup screen
  return <AuthScreen setUser={setUser} />;
}

// This is the screen where people can sign up or log in
const AuthScreen = ({
  setUser,
}: {
  setUser: Dispatch<SetStateAction<UserCredential | null>>;
}) => {
  // These variables keep track of what the user types in the form
  const [isSignup, setIsSignup] = useState<boolean>(false); // Switches between signup and login 
  const [userEmail, setUserEmail] = useState<string>("");   // Stores the user's email
  const [userPassword, setUserPassword] = useState<string>(""); // Stores the user's password 
  const [userConfirmPassword, setUserConfirmPassword] = useState<string>(""); // Stores the confirm password

  // Resets the input fields back to empty
  const resetValues = () => {
    setUserEmail("");
    setUserPassword("");
    setUserConfirmPassword("");
  };

  // This function tries to create a new user account with email and password 
  const createUser: (
    email: string,
    password: string
  ) => Promise<UserCredential | undefined> = async (
    email: string,
    password: string
  ) => {
    const auth = getAuth(); // Get the Firebase tool to manage users
    try {
      // Try creating a new user with email and password 
      const createUserAttempt = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("createUserAttempt =", createUserAttempt); // Show what happens in the console 
      return createUserAttempt; // If it works, send back the new user's info
    } catch (error) {
      console.error("error =", error); // If it fails, show the error
    }
  };

  return (
    <div
      className="container flex justify-center items-center"
      style={{
        // borderWidth: 1,
        // borderStyle: "solid",
        // borderColor: "black",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div className="relative flex flex-col justify-center h-screen overflow-hidden">
        <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-lg">
          <h1 className="text-3xl font-semibold text-center text-purple-700">
            Firebase Auth
          </h1>
          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="text-base label-text">Email</span>
              </label>
              <input
                type="text"
                placeholder="Email Address"
                className="w=full input-bordered input-primary"
                value={userEmail}
                onChange={(e) => {
                  setUserEmail(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="label">
                <span className="text-base label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                className="w-full input input-bordered input-primary"
                value={userPassword}
                onChange{(e) => {
                  setUserPassword(e.target.value);
                }}
              />
            </div>
            {isSignup && (
              <div>
                <label className="label">
                  <span className="text-base label-text">Confirm Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  className="w-full input input-bordered input-primary"
                  value={userConfirmPassword}
                  onChange={(e) => {
                    setUserPassword(e.target.value);
                  }}
                />
              </div>
             )}
             {/* <a
               href="#"
               className="text-xs text-gray-600 hover:underline hover:text-blue-600"
              >
               Forget Password?
             </a> */}
             <div>
              <button
                className="btn btn-primary mr-2"
                onClick={async () => {
                  if (isSignup) return setIsSignup(false);

                  const auth = getAuth();
                  const signInAttempt = await signInWithEmailAndPassword(
                    auth,
                    userEmail,
                    userPassword
                );
                console.log("signInAttempt =", signInAttempt);
                if(signInAttempt){
                  setUser(signInAttempt);
                }
              }}
            >
              Login
            </button>
            <button
              className="btn btn-secondary"
              // disabled={

              // // userPassword !== userConfirmPassword ||
              // // userPassword == "" ||
              // // userConfirmPassword == ""
              // }
              onClick={async ()=> {
                if(!isSignup) return setIsSignup(true);
                const createUserPayload: {
                  email: string;
                  password: string;
                  confirmPassword?: string;
                } = {
                  email: userEmail,
                  password: userPassword,
                  confirmPassword: userConfirmPassword,
                };

                if (Object.values(createUserPayload).some((v) => v ==="")) {
                  resetValues();
                  return alert("check input values...");
                }
                
                console.log("createUserPayload =", createUserPayload);

                if (
                  createUserPayload.password !==
                  createUserPayload.confirmPassword
                ) {
                  resetValues();
                  return alert("password and confirm password do not match");
                }

                const firebaseUser: UserCredential | undefined =
                  await createUser(
                    createUserPayload.email,
                    createUserPayload.password
                  );

                if (firebaseUser) {
                  setUser(firebaseUser);
                }
              }}
            >
              Signup
            </button>
          </div>
        </div>
      </div>
    </div>  
  </div> 
 );
};
