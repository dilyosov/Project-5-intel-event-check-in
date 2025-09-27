document.addEventListener("DOMContentLoaded", function () {
  // Get all needed DOM elements
  const form = document.getElementById("checkInForm");
  const nameInput = document.getElementById("attendeeName");
  const teamSelect = document.getElementById("teamSelect");

  // Add a greeting message element
  const greetingMessage = document.getElementById("greetingMessage");

  // Track attendance
  let count = 0;
  const MaxCount = 50;

  const attendeeCount = document.getElementById("attendeeCount");
  const progressBar = document.getElementById("progressBar");

  // Team counters
  let waterCount = 0;
  let zeroCount = 0;
  let powerCount = 0;

  // Attendee lists for each team
  const waterAttendees = document.getElementById("waterAttendees");
  const zeroAttendees = document.getElementById("zeroAttendees");
  const powerAttendees = document.getElementById("powerAttendees");

  // Attendee list
  let attendeeList = [];

  // Define sample data arrays for each team before using them
  const waterWiseAttendees = [];
  const netZeroAttendees = [];
  const renewablesAttendees = [];

  // Helper function to show falling confetti and poppers
  function showConfetti() {
    // Falling confetti
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement("span");
      confetti.textContent = "🎉";
      confetti.style.position = "fixed";
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = "-40px";
      confetti.style.fontSize = "2rem";
      confetti.style.pointerEvents = "none";
      confetti.style.zIndex = "1000";
      document.body.appendChild(confetti);

      let fallDistance = 0;
      const fallInterval = setInterval(function () {
        fallDistance += 5;
        confetti.style.top = `${fallDistance}px`;
        if (fallDistance > window.innerHeight) {
          clearInterval(fallInterval);
          confetti.remove();
        }
      }, 30);
    }

    // Popper confetti (pop out from center)
    for (let i = 0; i < 20; i++) {
      const popper = document.createElement("span");
      popper.textContent = "🎊";
      popper.style.position = "fixed";
      popper.style.left = "50%";
      popper.style.top = "50%";
      popper.style.fontSize = "2rem";
      popper.style.pointerEvents = "none";
      popper.style.zIndex = "1000";
      document.body.appendChild(popper);

      // Random direction
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 300 + 100;
      let step = 0;
      const popInterval = setInterval(function () {
        step += 10;
        const x = Math.cos(angle) * step;
        const y = Math.sin(angle) * step;
        popper.style.left = `calc(50% + ${x}px)`;
        popper.style.top = `calc(50% + ${y}px)`;
        if (step > distance) {
          clearInterval(popInterval);
          popper.remove();
        }
      }, 30);
    }
  }

  // Load counts and attendee list from localStorage
  if (localStorage.getItem("attendanceCount")) {
    count = parseInt(localStorage.getItem("attendanceCount"));
    attendeeCount.textContent = count;
  }
  if (localStorage.getItem("waterCount")) {
    waterCount = parseInt(localStorage.getItem("waterCount"));
    document.getElementById("waterCount").textContent = waterCount;
  }
  if (localStorage.getItem("zeroCount")) {
    zeroCount = parseInt(localStorage.getItem("zeroCount"));
    document.getElementById("zeroCount").textContent = zeroCount;
  }
  if (localStorage.getItem("powerCount")) {
    powerCount = parseInt(localStorage.getItem("powerCount"));
    document.getElementById("powerCount").textContent = powerCount;
  }
  if (localStorage.getItem("attendeeList")) {
    attendeeList = JSON.parse(localStorage.getItem("attendeeList"));
    renderAttendeeLists();
  }
  // Set progress bar on load
  const percentage = (count / MaxCount) * 100;
  progressBar.style.width = `${percentage}%`;

  function renderAttendeeLists() {
    // Clear all lists
    waterAttendees.innerHTML = "";
    zeroAttendees.innerHTML = "";
    powerAttendees.innerHTML = "";

    // Count attendees for each team
    let waterTeam = 0;
    let zeroTeam = 0;
    let powerTeam = 0;

    for (let i = 0; i < attendeeList.length; i++) {
      const attendee = attendeeList[i];
      if (attendee.team === "water") {
        waterTeam++;
        const item = document.createElement("div");
        item.className = "attendee-item";
        item.textContent = attendee.name;
        waterAttendees.appendChild(item);
      } else if (attendee.team === "zero") {
        zeroTeam++;
        const item = document.createElement("div");
        item.className = "attendee-item";
        item.textContent = attendee.name;
        zeroAttendees.appendChild(item);
      } else if (attendee.team === "power") {
        powerTeam++;
        const item = document.createElement("div");
        item.className = "attendee-item";
        item.textContent = attendee.name;
        powerAttendees.appendChild(item);
      }
    }

    // Update team counters
    if (document.getElementById("waterCount")) {
      document.getElementById("waterCount").textContent = waterTeam;
    }
    if (document.getElementById("zeroCount")) {
      document.getElementById("zeroCount").textContent = zeroTeam;
    }
    if (document.getElementById("powerCount")) {
      document.getElementById("powerCount").textContent = powerTeam;
    }

    // Save team counts for winner calculation
    waterCount = waterTeam;
    zeroCount = zeroTeam;
    powerCount = powerTeam;
  }

  // Function to populate a list and update counter
  function populateList(listId, attendeesArray, counterId) {
    const listElement = document.getElementById(listId);
    listElement.innerHTML = "";
    for (let i = 0; i < attendeesArray.length; i++) {
      const attendee = attendeesArray[i];
      const listItem = document.createElement("li");
      listItem.textContent = attendee;
      listElement.appendChild(listItem);
    }
    // Update counter
    document.getElementById(counterId).textContent = attendeesArray.length;
  }

  // Make sure the elements exist before calling populateList
  if (
    document.getElementById("water-wise-attendees") &&
    document.getElementById("waterWiseCount")
  ) {
    populateList("water-wise-attendees", waterWiseAttendees, "waterWiseCount");
  }
  if (
    document.getElementById("net-zero-attendees") &&
    document.getElementById("netZeroCount")
  ) {
    populateList("net-zero-attendees", netZeroAttendees, "netZeroCount");
  }
  if (
    document.getElementById("renewables-attendees") &&
    document.getElementById("renewablesCount")
  ) {
    populateList(
      "renewables-attendees",
      renewablesAttendees,
      "renewablesCount"
    );
  }

  // Handle form submission
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log(form);

    // Get form values
    const name = nameInput.value;
    const team = teamSelect.value;
    const teamName = teamSelect.options[teamSelect.selectedIndex].text;

    console.log(name, teamName);

    // Increment count
    count++;
    attendeeCount.textContent = count;
    localStorage.setItem("attendanceCount", count);

    // Update progress bar
    const percentage = (count / MaxCount) * 100;
    progressBar.style.width = `${percentage}%`;
    console.log(`Progress: ${percentage}%`);

    // Add attendee to list
    attendeeList.push({ name: name, team: team, teamName: teamName });
    localStorage.setItem("attendeeList", JSON.stringify(attendeeList));
    renderAttendeeLists();

    // Show welcome message
    const message = `🎉 Welcome ${name} to ${teamName} 🎉`;
    greetingMessage.textContent = message;

    // Clear input fields after submit
    nameInput.value = "";
    teamSelect.selectedIndex = 0;

    // Celebration feature
    if (count >= MaxCount) {
      // Calculate winner based on latest counts
      let winningTeam = "";
      let winningCount = Math.max(waterCount, zeroCount, powerCount);

      if (winningCount === waterCount && waterCount !== 0) {
        winningTeam = "🌊 Team Water Wise";
      } else if (winningCount === zeroCount && zeroCount !== 0) {
        winningTeam = "🌿 Team Net Zero";
      } else if (winningCount === powerCount && powerCount !== 0) {
        winningTeam = "⚡ Team Renewables";
      } else {
        winningTeam = "No team";
      }

      // Show celebration message
      greetingMessage.textContent = `🎊 Attendance goal reached! Congratulations to ${winningTeam}! 🎊`;

      // Show confetti emojis
      showConfetti();

      // Reset all progress and counts
      count = 0;
      waterCount = 0;
      zeroCount = 0;
      powerCount = 0;
      attendeeCount.textContent = count;
      progressBar.style.width = "0%";

      // Reset attendee list
      attendeeList = [];
      localStorage.setItem("attendeeList", JSON.stringify(attendeeList));
      renderAttendeeLists();

      // Clear localStorage
      localStorage.setItem("attendanceCount", count);
      localStorage.setItem("waterCount", waterCount);
      localStorage.setItem("zeroCount", zeroCount);
      localStorage.setItem("powerCount", powerCount);
    }
  });
});
