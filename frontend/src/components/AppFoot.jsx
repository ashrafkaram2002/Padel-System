import React from "react";
import { Footer, Tooltip } from "flowbite-react";

export default function AppFoot() {
  return (
    <div>
      <Footer container>
        <div className="w-full flex justify-between">
          <div className="relative flex items-center">
            <Tooltip
              content="email/phone"
              style="light"
              placement="top"
              className="text-md"
            >
              <span className="text-grey-500 font-semibold text-md hover:text-blue-700 hover:cursor-pointer">
                Contact us
              </span>
            </Tooltip>
          </div>
          <div className="flex justify-center">
            <Footer.Copyright
              href="#"
              by="Padel Score Tracker™"
              year={new Date().getFullYear()}
            />
          </div>
        </div>
      </Footer>
    </div>
  );
}
