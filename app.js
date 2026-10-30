"use strict";

function getGreeting(hour) {
    if (hour < 12) {
        return "Good morning";
    }
    if (hour < 18) {
        return "Good afternoon";
    }
    return "Good evening";
}

function renderHeader(person) {
    const { name, role, location: place } = person;
    const phone = person.contact?.phone ?? "Phone not provided";
    const greeting = getGreeting(new Date().getHours());

    document.getElementById("profile-name").textContent = name;
    document.getElementById("profile-role").textContent = role;
    document.getElementById("profile-greeting").textContent = `${greeting}! Welcome to my profile.`;
    document.getElementById("profile-place").textContent = `${place} | ${phone}`;
}

renderHeader(profile);
