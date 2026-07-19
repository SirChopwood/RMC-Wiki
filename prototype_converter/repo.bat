cd "../"
git clone "https://github.com/RMC-14/RMC-14.git" --no-checkout "RMC14" --depth 1
cd "RMC14"
git sparse-checkout init --cone
git sparse-checkout add "Resources/Prototypes/"
git checkout

