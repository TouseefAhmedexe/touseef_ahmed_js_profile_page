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

function pluralize(count, word) {
    return `${count} ${word}${count === 1 ? "" : "s"}`;
}

function formatExperience(totalMonths) {
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years === 0) {
        return pluralize(months, "month");
    }
    if (months === 0) {
        return pluralize(years, "year");
    }
    return `${pluralize(years, "year")} ${pluralize(months, "month")}`;
}

const getTotalMonths = (jobs) => jobs.reduce((total, job) => total + job.months, 0);

function getExperienceMessage(totalMonths) {
    if (totalMonths >= 24) {
        return "I have worked and taught for more than two years.";
    }
    if (totalMonths >= 12) {
        return "I have worked and taught for more than a year.";
    }
    return "I am at the start of my career.";
}

function renderAbout(person) {
    const [latestJob] = person.experience;
    const totalMonths = getTotalMonths(person.experience);

    document.getElementById("about-summary").textContent = person.summary;
    document.getElementById("latest-role").textContent = `Latest listed role: ${latestJob.title} at ${latestJob.company}.`;
    document.getElementById("experience-message").textContent = `Total experience: ${formatExperience(totalMonths)}. ${getExperienceMessage(totalMonths)}`;
}

renderAbout(profile);
