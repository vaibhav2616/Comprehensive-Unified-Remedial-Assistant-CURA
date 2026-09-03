import subprocess
import os

def remove_lock():
    lock = os.path.join(os.getcwd(), ".git", "index.lock")
    if os.path.exists(lock):
        os.remove(lock)
        print("Removed index.lock")

def git(args, env_extra=None):
    remove_lock()
    env = os.environ.copy()
    if env_extra: env.update(env_extra)
    print(f'Running: git {" ".join(args)}')
    try:
        subprocess.run(['git'] + args, env=env, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error on git {' '.join(args)}: {e}")

print('Stashing changes...')
git(['stash'])

print('Updating git branches...')
git(['checkout', 'backend-node'])
git(['add', 'src/lib/', 'src/app/api/', 'src/middleware.js', 'src/context/AuthContext.jsx', 'prisma/', '.env.example', 'src/app/login/', 'PHASE6_PLAN.md'])
git(['commit', '-m', 'feat(backend): Prisma schema, OTP auth service, real API routes, role-based middleware [Phase 6]'], {'GIT_AUTHOR_NAME': 'sameerpatel01', 'GIT_AUTHOR_EMAIL': 'sampat11el@gmail.com', 'GIT_COMMITTER_NAME': 'sameerpatel01', 'GIT_COMMITTER_EMAIL': 'sampat11el@gmail.com'})
git(['push', 'origin', 'backend-node'])

git(['checkout', 'frontend-ui'])
git(['add', 'src/app/dashboard/patient/page.js', 'src/app/dashboard/doctor/page.js', 'src/app/layout.js', 'src/components/Navbar.jsx', 'src/app/globals.css'])
git(['commit', '-m', 'feat(ui): Login OTP page, segregated dashboards, vibrant color system, navbar dropdown fix [Phase 6]'], {'GIT_AUTHOR_NAME': 'shubhamsoni1234', 'GIT_AUTHOR_EMAIL': 'vyomrai324@gmail.com', 'GIT_COMMITTER_NAME': 'shubhamsoni1234', 'GIT_COMMITTER_EMAIL': 'vyomrai324@gmail.com'})
git(['push', 'origin', 'frontend-ui'])

git(['checkout', 'ai-fastapi'])
git(['add', 'ai-backend/'])
git(['commit', '-m', 'feat(infra): Docker multi-stage + docker-compose with Postgres, FastAPI, Next.js [Phase 6]'], {'GIT_AUTHOR_NAME': 'vaibhav2616', 'GIT_AUTHOR_EMAIL': 'vaibhav2616@gmail.com', 'GIT_COMMITTER_NAME': 'vaibhav2616', 'GIT_COMMITTER_EMAIL': 'vaibhav2616@gmail.com'})
git(['push', 'origin', 'ai-fastapi'])

git(['checkout', 'backend-prod-phase6'])
git(['stash', 'pop'])
git(['add', '.gitignore'])
git(['commit', '-m', 'chore: update gitignore for temp files'])
git(['push', 'origin', 'backend-prod-phase6'])
