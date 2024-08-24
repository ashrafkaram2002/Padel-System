import React from "react";
import { Button, Label, TextInput } from "flowbite-react";

export default function Login() {
  return (
    <div className="w-1/2 h-3/4 flex items-center justify-center p-6">
      <form
        className="flex flex-col gap-8 bg-white p-6 rounded shadow-2xl"
        style={{ width: "50%", height: "100%" }}
      >
        <Label
          value="Login Form"
          style={{ color: "blue" }}
          className="text-2xl font-bold text-center"
        />
        <div>
          <div className="mb-2 block">
            <Label className="text-lg" htmlFor="username" value="Username" />
          </div>
          <TextInput id="username" type="text" required />
        </div>
        <div>
          <div className="mb-2 block">
            <Label className="text-lg" htmlFor="password" value="Password" />
          </div>
          <TextInput id="password" type="password" required />
        </div>
        <Button className="text-lg" color="blue" type="submit">
          Sign in
        </Button>
      </form>
    </div>
  );
}
