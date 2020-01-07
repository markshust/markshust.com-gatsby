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
          height: 50,
        }}
      >
        <strong>Mark Shust</strong>
      </div>
    </a>
  </div>
)

export default Bio
