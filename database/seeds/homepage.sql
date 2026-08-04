-- =====================================================================
-- seeds/homepage.sql
-- Data for the Home page only.
-- Requires schema.sql to have been run first (tables must exist).
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- page_content
-- ---------------------------------------------------------------------
INSERT INTO page_content (section_key, title, body, display_order) VALUES
('hero', 'Department of Physics - CUSAT',
 'Established in 1971, the Department of Physics, CUSAT has maintained the highest standards in postgraduate education and research in physics. Over the years, the Department has become the go-to place for students in Kerala who wish to pursue advanced studies in Physics. Our researchers and postgraduates are consistently placed in faculty, postdoctoral and PhD positions in world-renowned institutions and universities across the globe.',
 1),
('vision', 'Vision',
 'Going forward, the Department of Physics envisions continuing the mission of providing quality advanced training in Physics to students through its Masters and newly established Integrated M.Sc. programs and carrying out excellent scientific research. The Department aims to take a leading role in the revolutionary changes envisaged in the 21st century in science in general and physics in particular.',
 2),
('research_labs', 'Research Labs',
 'Department of Physics has eighteen Research Labs across diverse fields in Physics with experienced faculties. They provide a supporting ecosystem for growing young scientists.',
 3),
('faculties', 'Our Faculties',
 'Our faculty are in active collaborative research with global and national leading institutions, including NTU & NUS (Singapore), Rice University, Durham University, Fermilab, University of Washington, Weizmann Institute, University of Augsburg, BARC, HBCSE, IUAC, IGCAR, RRI, IUCAA, IITs and IISERs.',
 4),
('facilities', 'Facilities',
 'Instruments that you can rely on to get accurate results.',
 5);

-- ---------------------------------------------------------------------
-- courses
-- ---------------------------------------------------------------------
INSERT INTO courses (name, display_order) VALUES
('MSc', 1),
('PhD', 2);

-- ---------------------------------------------------------------------
-- collaborating_institutions
-- ---------------------------------------------------------------------
INSERT INTO collaborating_institutions (institution_name) VALUES
('NTU (Singapore)'),
('NUS (Singapore)'),
('Rice University'),
('Durham University'),
('Fermilab'),
('University of Washington'),
('Weizmann Institute'),
('University of Augsburg'),
('BARC'),
('HBCSE'),
('IUAC'),
('IGCAR'),
('RRI'),
('IUCAA'),
('IITs'),
('IISERs');

-- ---------------------------------------------------------------------
-- testimonials
-- ---------------------------------------------------------------------
INSERT INTO testimonials (author_name, author_designation, quote, display_order) VALUES
('Chithra R Nayak', 'Associate Professor, Tuskegee University, USA',
 'Reflects on being part of a talented student batch that broadened her scientific, personal, and political outlook, and describes the department as an ideal place to have pursued her master''s and PhD studies as a first-generation college student.',
 1),
('Nikhil Mohan', 'International Partner, Neutrino Group ICISE, Vietnam',
 'Credits CUSAT with providing the foundational knowledge, skills, and professional associations needed to build a career in science.',
 2),
('Shifana Koya', 'SWATNet - Marie Sklodowska-Curie Action ITN PhD Fellow',
 'Describes her post-graduation years in Physics as an eye-opening experience shaped by a passionate and supportive faculty who prepared students to become well-rounded researchers and professionals.',
 3),
('Sarath Prem', 'PhD Student, Institute of Physics, Warsaw, Poland',
 'Credits the guidance of teachers and support for extracurricular academic activities during his PhD, along with campus life, for developing social skills valuable in multicultural settings abroad.',
 4);

COMMIT;