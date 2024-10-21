import time
import os
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException

# Setup the WebDriver (assuming Chrome here)
driver = webdriver.Chrome()

# Open the LinkedIn jobs page
driver.get("https://www.linkedin.com/jobs/search/?currentJobId=4036934438&geoId=101165590&keywords=Software%20Engineer&origin=JOB_SEARCH_PAGE_LOCATION_AUTOCOMPLETE&refresh=true")

def close_any_modal():
    """Close any modal that might appear on the page."""
    try:
        close_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, ".modal__dismiss"))
        )
        close_button.click()
        print("Closed the modal.")
    except (TimeoutException, NoSuchElementException):
        print("No modal found or modal already closed.")

def scroll_down():
    """Scroll down the page to load more job results."""
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(2)  # Allow time for jobs to load

def scroll_up():
    """Scroll up the page a little bit."""
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight - 300);")
    time.sleep(2)  # Allow time for any jobs to load

def click_see_more_button():
    """Click the 'See more jobs' button if available and wait for the content to load."""
    try:
        see_more_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable(
                (By.XPATH, "//button[@aria-label='See more jobs' and contains(@class, 'infinite-scroller__show-more-button')]")
            )
        )
        see_more_button.click()
        print("Clicked 'See more jobs' button.")
        time.sleep(5)  # Wait for new jobs to load
        return True
    except (TimeoutException, NoSuchElementException) as e:
        print(f"No 'See more jobs' button found. Error: {e}")
        return False

def scrape_companies():
    """Scrape company names, job titles, and links from the currently loaded jobs."""
    job_list = []  # List to store all jobs as tuples (company, job title, link)
    try:
        # Get all companies, job titles, and links from the loaded job cards
        companies = driver.find_elements(By.CLASS_NAME, "base-search-card__subtitle")
        job_titles = driver.find_elements(By.CLASS_NAME, "base-search-card__title")
        links = driver.find_elements(By.CLASS_NAME, "base-card__full-link")

        # Iterate over job titles, companies, and links
        for job_title, company, link in zip(job_titles, companies, links):
            company_name = company.text.strip()
            job_title_text = job_title.text.strip()  # Get the job title
            job_link = link.get_attribute("href")  # Get the job link

            # Add every job entry as a tuple to the list
            if company_name and job_title_text and job_link:
                job_list.append((company_name, job_title_text, job_link))  # Store as a tuple

    except Exception as e:
        print(f"Error scraping companies: {e}")

    return job_list  # Return the list to process outside

def check_all_jobs_viewed():
    """Check if the 'You've viewed all jobs' message is present."""
    try:
        viewed_all_element = driver.find_element(
            By.XPATH, "//p[contains(@class, 'inline-notification__text') and contains(text(), \"You've viewed all jobs for this search\")]"
        )
        return viewed_all_element is not None
    except NoSuchElementException:
        return False

def scrape_jobs(target_count=100):
    """Main function to scrape jobs and companies."""
    total_jobs = []  # List to store all scraped jobs

    try:
        close_any_modal()  # Close any modal popup that may block the content

        while len(total_jobs) < target_count:
            scroll_down()  # Scroll down the page to load more jobs

            # Scrape and store company names, job titles, and links
            scraped_jobs = scrape_companies()
            total_jobs.extend(scraped_jobs)  # Add new jobs to the total list

            # If we've scraped enough jobs, break the loop
            if len(total_jobs) >= target_count:
                print(f"Reached the target of {target_count} jobs.")
                break

            # Check if the "See more jobs" button appears and click it if available
            if not click_see_more_button():
                # If no "See more jobs" button is found, check for the "You've viewed all jobs" message
                if check_all_jobs_viewed():
                    print("All jobs have been loaded.")
                    break  # Exit the loop if all jobs are loaded
                else:
                    print("No more jobs to load. Trying to scroll up and then down again...")
                    scroll_up()  # Scroll up a bit
                    scroll_down()  # Try to scroll down again
                    continue  # Continue the loop

    except Exception as e:
        print(f"Error: {e}")

    finally:
        print(f"Total jobs scraped: {len(total_jobs)}")

        # Create a DataFrame from the scraped job data
        df = pd.DataFrame(total_jobs, columns=["Company", "Job Title", "Link"])

        # Define the path to save the CSV file (change 'YOUR_USERNAME' to your actual username)
        desktop_path = os.path.join(os.path.expanduser("~"), "Desktop")
        csv_file_path = os.path.join(desktop_path, "scraped_jobs_list.csv")

        # Write the job data to a CSV file using pandas
        df.to_csv(csv_file_path, index=False, encoding='utf-8')
        print(f"Data saved to {csv_file_path}")

        # Do not close the driver after finishing
        input("Press Enter to close the browser...")

# Call the main scrape_jobs function to start the process
scrape_jobs(100)
