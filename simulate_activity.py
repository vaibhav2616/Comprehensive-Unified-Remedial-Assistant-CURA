import subprocess
import os
import random
from datetime import datetime, timedelta

def remove_lock():
    lock = os.path.join(os.getcwd(), ".git", "index.lock")
    if os.path.exists(lock):
        os.remove(lock)

def git(args, env_extra=None, capture=False):
    remove_lock()
    env = os.environ.copy()
    if env_extra: env.update(env_extra)
    print(f'Running: git {" ".join(args)}')
    try:
        if capture:
            return subprocess.run(['git'] + args, env=env, check=True, capture_output=True, text=True).stdout.strip()
        subprocess.run(['git'] + args, env=env, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error on git {' '.join(args)}: {e}")

USERS = [
    {"name": "vaibhav2616", "email": "vaibhav2616@gmail.com", "weight": 65},
    {"name": "sameerpatel01", "email": "sam.patel01@gmail.com", "weight": 11},
    {"name": "shubhamsoni1234", "email": "shubham.soni1234@gmail.com", "weight": 12},
    {"name": "tusharsingh7753", "email": "tusharsingh7753@gmail.com", "weight": 12},
]

def pick_user():
    r = random.uniform(0, 100)
    for u in USERS:
        if r <= u['weight']: return u
        r -= u['weight']
    return USERS[0]

# Ensure we're on master
git(['checkout', 'master'])

# Generate 5 fake "issues/PRs" today
now = datetime.now()
current_time = now - timedelta(hours=4)  # Start 4 hours ago

issues = [
    "Fix authentication error states",
    "Update dashboard styles and responsive layout",
    "Add more detailed patient profiles",
    "Optimize Next.js image loading",
    "Refactor AI analysis endpoints"
]

for i, issue in enumerate(issues):
    user = pick_user()
    branch_name = f"feature/issue-{random.randint(100, 999)}-{user['name']}"
    
    # Create branch
    git(['checkout', '-b', branch_name])
    
    # Make a dummy change
    filename = f"dummy_{i}.txt"
    with open(filename, 'w') as f:
        f.write(f"Addressed issue: {issue}\n")
    
    current_time += timedelta(minutes=random.randint(15, 45))
    dt_str = current_time.strftime("%Y-%m-%dT%H:%M:%S+05:30")
    env = {
        "GIT_AUTHOR_NAME": user["name"], "GIT_AUTHOR_EMAIL": user["email"],
        "GIT_COMMITTER_NAME": user["name"], "GIT_COMMITTER_EMAIL": user["email"],
        "GIT_AUTHOR_DATE": dt_str, "GIT_COMMITTER_DATE": dt_str
    }
    
    git(['add', filename])
    git(['commit', '-m', f"feat/fix: {issue}", '--author', f"{user['name']} <{user['email']}>"], env)
    
    # Checkout master & merge
    git(['checkout', 'master'])
    
    # The merge commit is done by the repo owner (vaibhav2616) pulling in the team's PR
    merge_time = current_time + timedelta(minutes=random.randint(5, 30))
    merge_dt_str = merge_time.strftime("%Y-%m-%dT%H:%M:%S+05:30")
    owner = USERS[0]
    merge_env = {
        "GIT_AUTHOR_NAME": owner["name"], "GIT_AUTHOR_EMAIL": owner["email"],
        "GIT_COMMITTER_NAME": owner["name"], "GIT_COMMITTER_EMAIL": owner["email"],
        "GIT_AUTHOR_DATE": merge_dt_str, "GIT_COMMITTER_DATE": merge_dt_str
    }
    
    git(['merge', '--no-ff', branch_name, '-m', f"Merge pull request #{random.randint(10, 99)} from {user['name']}/{branch_name}\n\n{issue}"], merge_env)
    
    # Delete the local feature branch
    git(['branch', '-D', branch_name])

# Finally push master
git(['push', 'origin', 'master'])

print("Successfully simulated GitHub activity on master branch.")
