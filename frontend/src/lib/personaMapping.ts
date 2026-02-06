export const PERSONA_IMAGES: Record<string, string> = {
    // General
    "Compassionate Friend": "/assets/personality/general/compasionate friend.png",
    "Academic Coach": "/assets/personality/general/academic coach.png",
    "Mindfulness Guide": "/assets/personality/general/mindfullness guide.png",
    "Motivational Coach": "/assets/personality/general/motivational coach.png",

    // Family
    "Mother": "/assets/personality/family/mother.png",
    "Father": "/assets/personality/family/father.png",
    "Sister": "/assets/personality/family/sister.png",
    "Brother": "/assets/personality/family/brother.png",
    "Cool Parent": "/assets/personality/family/cool parents.png", // plural in file
    "Cool Uncle": "/assets/personality/family/cool uncle.png",
    "Grandma": "/assets/personality/family/grand mother.png",
    "Grandpa": "/assets/personality/family/grand father.png",
    "Little Sibling": "/assets/personality/family/younger sibling.png",
    "The Pet": "/assets/personality/family/pet.png",

    // Education
    "School Teacher": "/assets/personality/education/school teacher.png",
    "Professor": "/assets/personality/education/university professor.png",

    // Friends
    "Best Friend": "/assets/personality/friend/best friend.png",
    "Study Partner": "/assets/personality/friend/study partner.png",

    // Dating
    "Partner": "/assets/personality/dating/lover.png",

    // Spiritual
    "Peaceful Scie": "/assets/personality/spiritual/Dalai Lama.png", // Assuming name mapping from backend
    "Modern Mystic": "/assets/personality/spiritual/Sadguru.png",

    // Psychology
    "Empathetic Listener": "/assets/personality/phycology/Carl Rogers.png",
    "The Analyst": "/assets/personality/phycology/Sigmund Freud.png",
    "Empowering Mentor": "/assets/personality/phycology/Oprah Mentor.png",

    // Entrepreneur
    "Logical Mentor": "/assets/personality/enteprenour/Logical Mentor.png",
    "Visionary Builder": "/assets/personality/enteprenour/Mukesh Ambani.png",
    "First Principles": "/assets/personality/enteprenour/elon musk.png",

    // Famous
    "Brittany": "/assets/personality/famous internet/Brittany Broski.png",
    "Delaney": "/assets/personality/famous internet/Delaney Rowe.png",
    "Rob": "/assets/personality/famous internet/Rob Anderson.png",

    // Indian Stars
    "Ashish": "/assets/personality/indian stars/ashish chanchalani.png",
    "Bhuvan": "/assets/personality/indian stars/bhuvan bam.png",
    "Samey": "/assets/personality/indian stars/samay raina.png",
    "King Khan": "/assets/personality/indian stars/shah rukh khan.png",
    "Zakir": "/assets/personality/indian stars/zakir khan.png",
    "BeerBiceps": "/assets/personality/indian stars/beerbiceps.png",
    "Warikoo": "/assets/personality/indian stars/warikoo.png",

    // Philosophers
    "The Stoic": "/assets/personality/philosophers/marcus aurelius.png",
    "The Questioner": "/assets/personality/philosophers/Socrates.png",
    "The Mystic": "/assets/personality/philosophers/alan watts.png",
    "The Poet": "/assets/personality/philosophers/rumi.png", // Rumi doubles as Poet here

    // Scientists
    "Einstein": "/assets/personality/scientist/Albert Einstein.png",
    "Missile Man": "/assets/personality/scientist/APJ Abdul Kalam.png",
    "Madame Curie": "/assets/personality/scientist/Marie Curie.png",
    "The Visionary": "/assets/personality/scientist/Steve Jobs.png",

    // Tough Love
    "Goggins": "/assets/personality/tough love/David Goggins.png",
    "The Professor": "/assets/personality/tough love/Jordan Peterson.png", // Note: Name clash with University Professor handled by specific key
    "Head Coach": "/assets/personality/tough love/strict coach.png",
    "Chef": "/assets/personality/tough love/gordon ramsay.png",

    // Creative
    "Lyrical Soul": "/assets/personality/creative/The Poet.png",
    "The Artist": "/assets/personality/creative/The Artist.png",
    "The Musician": "/assets/personality/creative/the musician.png",
    "Happy Painter": "/assets/personality/creative/Bob Ross.png",

    // Archetypes
    "Librarian": "/assets/personality/arch types/the librarian.png",
    "Gardener": "/assets/personality/arch types/the gardener.png",
    "Time Traveler": "/assets/personality/arch types/the time traveller.png",
    "The Universe": "/assets/personality/arch types/the universe.png",
};

export const getPersonaImage = (name: string): string | null => {
    return PERSONA_IMAGES[name] || null;
};
