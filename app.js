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

const skillSearch = document.getElementById("skill-search");
const skillCategory = document.getElementById("skill-category");
const skillMessage = document.getElementById("skill-message");
const skillAverage = document.getElementById("skill-average");

function getCategories(skillItems) {
    return skillItems.reduce((categories, skill) => {
        return categories.includes(skill.category) ? categories : [...categories, skill.category];
    }, []);
}

function buildOptionHtml(category) {
    return `<option value="${category}">${category}</option>`;
}

function filterSkills(skillItems, searchText, category) {
    const text = searchText.trim().toLowerCase();

    return skillItems.filter((skill) => {
        const matchesText = skill.name.toLowerCase().includes(text);
        const matchesCategory = category === "all" || skill.category === category;
        return matchesText && matchesCategory;
    });
}

function getResultMessage(count) {
    if (count === 0) {
        return "No skills match your search.";
    }
    if (count === 1) {
        return "1 skill found.";
    }
    return `${count} skills found.`;
}

function updateSkills() {
    const matches = filterSkills(profile.skills, skillSearch.value, skillCategory.value);
    const sortedMatches = sortByLevel(matches);

    renderList(skillList, sortedMatches, buildSkillHtml);
    skillMessage.textContent = getResultMessage(sortedMatches.length);
    skillAverage.textContent = sortedMatches.length === 0
        ? ""
        : `Average level of the skills shown: ${calculateAverageLevel(sortedMatches)} / 10`;
}

skillCategory.innerHTML = `<option value="all">All categories</option>${getCategories(profile.skills).map(buildOptionHtml).join("")}`;

skillSearch.addEventListener("input", updateSkills);
skillCategory.addEventListener("change", updateSkills);

updateSkills();

function createCounter() {
    let count = 0;

    return function () {
        count += 1;
        return count;
    };
}

function findSkill(skillItems, skillName) {
    const cleanName = skillName.trim().toLowerCase();

    if (cleanName === "") {
        throw new Error("Please type a skill name.");
    }

    const skill = skillItems.find((item) => item.name.toLowerCase() === cleanName);

    if (skill === undefined) {
        throw new Error(`"${skillName.trim()}" is not in my skill list. Check the spelling and try again.`);
    }

    return skill;
}

const lookupForm = document.getElementById("lookup-form");
const lookupInput = document.getElementById("lookup-input");
const lookupMessage = document.getElementById("lookup-message");
const nextLookupNumber = createCounter();

function handleLookup(event) {
    event.preventDefault();
    const lookupNumber = nextLookupNumber();

    try {
        const { name, category, level } = findSkill(profile.skills, lookupInput.value);
        lookupMessage.textContent = `Lookup ${lookupNumber}: ${name} is in ${category}. My level is ${level} out of 10 (${getLevelLabel(level)}).`;
        lookupMessage.className = "message message--success";
    } catch (error) {
        lookupMessage.textContent = `Lookup ${lookupNumber}: ${error.message}`;
        lookupMessage.className = "message message--error";
    } finally {
        lookupInput.value = "";
    }
}

lookupForm.addEventListener("submit", handleLookup);
