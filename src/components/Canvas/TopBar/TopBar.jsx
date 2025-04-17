import React from 'react';
import { Menu } from '@headlessui/react';

function AddObjectDropdown({ onCreateObject }) {
  return (
    <Menu as="div" className="relative">
      <Menu.Button
        className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg"
        aria-label="Add Object"
      >
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/ea4eede0e2d8973889d0149becc9d113f66c62766659c4fb67273b519da8803c?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
          className="object-contain shrink-0 rounded-none aspect-[1.06] w-[35px]"
          alt="+"
        />
      </Menu.Button>
      <Menu.Items className="absolute left-0 mt-2 w-32 origin-top-left rounded-md bg-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
        <div className="py-1 text-white text-sm">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => onCreateObject('cube')}
                className={`${
                  active ? 'bg-neutral-700' : ''
                } block w-full px-4 py-2 text-left`}
              >
                Cube
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => onCreateObject('sphere')}
                className={`${
                  active ? 'bg-neutral-700' : ''
                } block w-full px-4 py-2 text-left`}
              >
                Sphere
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => onCreateObject('plane')}
                className={`${
                  active ? 'bg-neutral-700' : ''
                } block w-full px-4 py-2 text-left`}
              >
                Plane
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => onCreateObject('cylinder')}
                className={`${
                  active ? 'bg-neutral-700' : ''
                } block w-full px-4 py-2 text-left`}
              >
                Cylinder
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
}

export default function TopBar({ onCreateObject }) {
  return (
    <div className="flex flex-wrap gap-5 justify-between py-2.5 pr-14 pl-3.5 ml-2.5 max-w-full text-sm whitespace-nowrap rounded-xl bg-zinc-900 bg-opacity-80 text-white text-opacity-80 w-[571px] max-md:pr-5">
      <div className="flex gap-6">
        <button 
          className="flex gap-2 px-3 py-2.5 rounded-xl bg-neutral-700 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          aria-label="Layout options">
          <div>Layout</div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/d2eb087205cfeda836c0ae1ed6f5e192cb387d015722cb3cf30f89304fc70ef4?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
            className="object-contain shrink-0 my-auto aspect-[1.5] w-[9px]"
            alt=""
          />
        </button>

        <div className="shrink-0 my-auto w-0 h-5 border-2 border-solid border-neutral-700 shadow-[0px_2px_4px_rgba(0,0,0,0.25)]" />

        <AddObjectDropdown onCreateObject={onCreateObject} />

        <div className="shrink-0 my-auto w-0 h-5 border-2 border-solid border-neutral-700 shadow-[0px_2px_4px_rgba(0,0,0,0.25)]" />
      </div>

      <div className="flex gap-6 items-center">
        <button 
          className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg"
          aria-label="Undo">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/7bb9edc5cbb83b04994ecf380b1eb689cdda54822b763f4a21e82113e7976ba4?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
            className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
            alt=""
          />
        </button>
        <div className="shrink-0 self-stretch my-auto w-0 h-5 border-2 border-solid border-neutral-700 shadow-[0px_2px_4px_rgba(0,0,0,0.25)]" />
        <button 
          className="focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg"
          aria-label="Redo">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/aefa27f3a4d84b2fb61917384a45b85c/f793412b018bf2e9007fb91d6732105045de4fd3563acdb13398cde43fc4156d?apiKey=aefa27f3a4d84b2fb61917384a45b85c&"
            className="object-contain shrink-0 self-stretch my-auto aspect-[1.21] w-[23px]"
            alt=""
          />
        </button>
        <div className="shrink-0 self-stretch my-auto w-0 h-5 border-2 border-solid border-neutral-700 shadow-[0px_2px_4px_rgba(0,0,0,0.25)]" />
        <button 
          className="self-stretch px-3.5 py-3 rounded-xl bg-neutral-700 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
          Export
        </button>
        <div className="shrink-0 self-stretch my-auto w-0 h-5 border-2 border-solid border-neutral-700 shadow-[0px_2px_4px_rgba(0,0,0,0.25)]" />
      </div>
    </div>
  );
}
