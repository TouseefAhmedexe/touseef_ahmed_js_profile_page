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

function renderList(container, items, buildHtml) {
    container.innerHTML = items.map(buildHtml).join("");
}

function calculateAverageLevel(skillItems) {
    if (skillItems.length === 0) {
        return 0;
    }

    const total = skillItems.reduce((sum, skill) => sum + skill.level, 0);
    return Math.round((total / skillItems.length) * 10) / 10;
}

function countByCategory(skillItems) {
    return skillItems.reduce((counts, skill) => {
        return { ...counts, [skill.category]: (counts[skill.category] ?? 0) + 1 };
    }, {});
}

function buildStatHtml({ label, value }) {
    return `<div class="stat-card"><span class="stat-value">${value}</span><span class="stat-label">${label}</span></div>`;
}

function buildCategoryHtml([category, count]) {
    return `<li class="tag">${category}: ${count}</li>`;
}

function renderStats(person) {
    const { skills, experience, projects, achievements } = person;
    const levels = skills.map((skill) => skill.level);
    const highestLevel = Math.max(...levels);
    const bestSkills = skills
        .filter((skill) => skill.level === highestLevel)
        .map((skill) => skill.name)
        .join(", ");

    const stats = [
        { label: "Skills", value: skills.length },
        { label: "Average level", value: `${calculateAverageLevel(skills)} / 10` },
        { label: `Highest level (${bestSkills})`, value: `${highestLevel} / 10` },
        { label: "Experience", value: formatExperience(getTotalMonths(experience)) },
        { label: "Projects", value: projects.length },
        { label: "Awards", value: achievements.length }
    ];

    renderList(document.getElementById("stat-grid"), stats, buildStatHtml);
    renderList(document.getElementById("category-counts"), Object.entries(countByCategory(skills)), buildCategoryHtml);
}

renderStats(profile);

function sortByLevel(skillItems) {
    return [...skillItems].sort((first, second) => second.level - first.level);
}

function getLevelLabel(level) {
    if (level >= 8) {
        return "Strong";
    }
    if (level >= 6) {
        return "Good";
    }
    return "Learning";
}

function buildSkillHtml({ name, category, level }) {
    return `
        <li class="skill-item">
            <span class="skill-name">${name}</span>
            <span class="skill-label">Level ${level} / 10: ${getLevelLabel(level)}</span>
            <span class="skill-category">${category}</span>
            <meter class="skill-meter" min="0" max="10" low="4" high="7" optimum="10" value="${level}">${level} out of 10</meter>
        </li>`;
}

const skillList = document.getElementById("skill-list");

renderList(skillList, sortByLevel(profile.skills), buildSkillHtml);
