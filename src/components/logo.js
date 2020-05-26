import React from "react"
import Avatar from "@components/avatar"

const Bio = () => (
  <div>
    <a href="/" style={{ boxShadow: "none", color: "inherit" }}>
      <Avatar />
      <div
        style={{
          display: "inline-block",
          verticalAlign: "bottom",
          fontSize: "1.2em",
          color: "#666",
          height: 80,
        }}
      >
        <strong>Mark Shust</strong>
      </div>
    </a>
  </div>
)

export default Bio
