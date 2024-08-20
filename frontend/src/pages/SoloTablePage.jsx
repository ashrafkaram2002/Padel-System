import React, { useState } from "react";
import AppNavBar from "../components/AppNavBar";
import AppFoot from "../components/AppFoot";
import { Table } from "flowbite-react";
import backgroundImage from "../assets/padelcourt.jpg";

export default function SoloTablePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const players = [
    { name: "John Doe", totalMatches: 15, totalScore: 5 },
    { name: "Jane Smith", totalMatches: 20, totalScore: 10 },
    { name: "Sam Wilson", totalMatches: 10, totalScore: 6 },
    { name: "Emily Davis", totalMatches: 12, totalScore: 8 },
    { name: "Michael Brown", totalMatches: 18, totalScore: 12 },
    { name: "Olivia Taylor", totalMatches: 25, totalScore: 15 },
    { name: "Liam Johnson", totalMatches: 22, totalScore: 11 },
  ];

  // Filter players based on the search query
  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <AppNavBar onLogin={false} />
      <div className="flex flex-col items-center justify-center my-10">
        {/* Search bar */}
        <div className="mb-4 w-full max-w-md">
          <input
            type="text"
            placeholder="Search by player"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-[37rem] w-1/2 my-5">
          <Table
            hoverable
            className="w-full border border-gray-300 rounded-lg shadow-md"
          >
            <Table.Head className="text-xl bg-gray-100 dark:bg-gray-700 border-b border-gray-300">
              <Table.HeadCell>Player Name</Table.HeadCell>
              <Table.HeadCell>Total Score</Table.HeadCell>
              <Table.HeadCell>Total Matches</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map((player, index) => (
                  <Table.Row
                    key={index}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800 text-lg"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white border-b border-gray-300">
                      {player.name}
                    </Table.Cell>
                    <Table.Cell className="border-b border-gray-300">
                      {player.totalScore}
                    </Table.Cell>
                    <Table.Cell className="border-b border-gray-300">
                      {player.totalMatches}
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan="3" className="text-center">
                    No players found
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
      </div>

      <AppFoot className="absolute bottom-0" />
    </div>
  );
}
