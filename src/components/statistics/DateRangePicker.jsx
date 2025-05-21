import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

function DateRangePicker({ period, onPeriodChange, periods }) {
  const selectedPeriod = periods.find(p => p.id === period);

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
        {selectedPeriod.label}
        <ChevronDownIcon className="h-4 w-4" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {periods.map((period) => (
            <Menu.Item key={period.id}>
              {({ active }) => (
                <button
                  onClick={() => onPeriodChange(period.id)}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                >
                  {period.label}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default DateRangePicker; 