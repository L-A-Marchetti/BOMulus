import { useShallow } from 'zustand/react/shallow';
import { AnalysisStore } from '../../store/AnalysisStore';
import Button from './Button';
import Input from './Input';

export default function Login() {
  const {
    loginIsVisible,
    email,
    password,
    toggleLoginVisibility,
    setEmail,
    setPassword,
    runAuth,
  } = AnalysisStore(
    useShallow((state) => ({
      loginIsVisible: state.loginIsVisible,
      email: state.email,
      password: state.password,
      toggleLoginVisibility: state.toggleLoginVisibility,
      setEmail: state.setEmail,
      setPassword: state.setPassword,
      runAuth: state.runAuth,
    })),
  );
  return loginIsVisible ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative p-4 w-full max-w-md bg-neutral-900 rounded-lg">
        <button
          type="button"
          className="cursor-pointer absolute top-3 end-2.5 text-neutral-400 bg-transparent rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center hover:bg-neutral-600 hover:text-white"
          onClick={toggleLoginVisibility}
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close modal</span>
        </button>
        <div className="p-4 md:p-5 text-center flex flex-col gap-2 mt-6">
          <Input
            placeHolder="Email"
            type="email"
            onChange={setEmail}
            value={email || ''}
            h="h-10"
          />
          <Input
            placeHolder="Password"
            type="password"
            onChange={setPassword}
            value={password || ''}
            h="h-10"
          />
          <Button
            onClick={runAuth}
            text="Login"
            bg="bg-neutral-700"
            bgHover="hover:bg-neutral-900"
            txtColor="text-neutral-400"
            h="h-10"
            img={null}
          />
          <button
            onClick={toggleLoginVisibility}
            className="cursor-pointer border-2 border-neutral-400 text-white bg-neutral-900 hover:bg-neutral-400 focus:ring-4 focus:outline-none focus:ring-neutral-800 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
