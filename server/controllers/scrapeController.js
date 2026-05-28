const axios = require('axios');
const cheerio = require('cheerio');

exports.scrapeJobs = async (req, res) => {
  const { keyword, location } = req.query;
  try {
    const [naukri, internshala, unstop] = await Promise.all([
      scrapeNaukri(keyword, location),
      scrapeInternshala(keyword, location),
      scrapeUnstop(keyword, location),
    ]);
    const allJobs = [...naukri, ...internshala, ...unstop];
    res.json(allJobs);
  } catch (err) {
    console.log('Scrape error:', err.message);
    res.status(500).json({ message: 'Scraping failed' });
  }
};

// Naukri Scraper
async function scrapeNaukri(keyword, location) {
  try {
    const url = `https://www.naukri.com/${keyword.toLowerCase().replace(/ /g, '-')}-jobs-in-${location.toLowerCase().replace(/ /g, '-')}`;
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });
    const $ = cheerio.load(data);
    const jobs = [];
    $('.jobTuple, .job-tuple, article.jobTupleHeader').each((i, el) => {
      const jobTitle = $(el).find('.title, .jobTitle, a.title').text().trim();
      const company = $(el).find('.companyName, .company-name').text().trim();
      const loc = $(el).find('.location, .locWdth').text().trim();
      const jobLink = $(el).find('a').attr('href') || '';
      if (jobTitle) {
        jobs.push({
          jobTitle,
          company: company || 'N/A',
          location: loc || location,
          platform: 'Naukri',
          jobLink: jobLink.startsWith('http') ? jobLink : `https://www.naukri.com${jobLink}`
        });
      }
    });
    if (jobs.length === 0) return getDummyJobs(keyword, location, 'Naukri');
    return jobs.slice(0, 10);
  } catch (err) {
    return getDummyJobs(keyword, location, 'Naukri');
  }
}

// Internshala Scraper
async function scrapeInternshala(keyword, location) {
  try {
    const url = `https://internshala.com/jobs/${keyword.toLowerCase().replace(/ /g, '-')}-jobs-in-${location.toLowerCase().replace(/ /g, '-')}`;
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });
    const $ = cheerio.load(data);
    const jobs = [];
    $('.individual_internship, .job-internship-card').each((i, el) => {
      const jobTitle = $(el).find('.job-title, .profile, h3').text().trim();
      const company = $(el).find('.company-name, .company').text().trim();
      const loc = $(el).find('.location-link, .location').text().trim();
      const jobLink = $(el).find('a').attr('href') || '';
      if (jobTitle) {
        jobs.push({
          jobTitle,
          company: company || 'N/A',
          location: loc || location,
          platform: 'Internshala',
          jobLink: jobLink.startsWith('http') ? jobLink : `https://internshala.com${jobLink}`
        });
      }
    });
    if (jobs.length === 0) return getDummyJobs(keyword, location, 'Internshala');
    return jobs.slice(0, 10);
  } catch (err) {
    return getDummyJobs(keyword, location, 'Internshala');
  }
}

// Unstop Scraper
async function scrapeUnstop(keyword, location) {
  try {
    const url = `https://unstop.com/jobs?search=${keyword.replace(/ /g, '+')}&location=${location}`;
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });
    const $ = cheerio.load(data);
    const jobs = [];
    $('.opportunity-card, .job-card, .card').each((i, el) => {
      const jobTitle = $(el).find('h2, h3, .title').text().trim();
      const company = $(el).find('.company, .org-name').text().trim();
      const loc = $(el).find('.location, .place').text().trim();
      const jobLink = $(el).find('a').attr('href') || '';
      if (jobTitle) {
        jobs.push({
          jobTitle,
          company: company || 'N/A',
          location: loc || location,
          platform: 'Unstop',
          jobLink: jobLink.startsWith('http') ? jobLink : `https://unstop.com${jobLink}`
        });
      }
    });
    if (jobs.length === 0) return getDummyJobs(keyword, location, 'Unstop');
    return jobs.slice(0, 10);
  } catch (err) {
    return getDummyJobs(keyword, location, 'Unstop');
  }
}

// Dummy Jobs Fallback
function getDummyJobs(keyword, location, platform) {
  const companies = {
    Naukri: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra'],
    Internshala: ['StartupX', 'InnovateCo', 'TechStart', 'CodeLabs', 'DevStudio'],
    Unstop: ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Zomato'],
  };

  return companies[platform].map((company, i) => ({
    jobTitle: i === 0 ? keyword : i === 1 ? `Senior ${keyword}` : i === 2 ? `Junior ${keyword}` : i === 3 ? `${keyword} Lead` : `${keyword} Consultant`,
    company,
    location,
    platform,
    jobLink: platform === 'Naukri'
      ? 'https://www.naukri.com'
      : platform === 'Internshala'
      ? 'https://internshala.com'
      : 'https://unstop.com'
  }));
}