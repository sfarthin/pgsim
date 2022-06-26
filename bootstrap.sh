#!/bin/bash

if brew -v ; then
    echo "✅ Homebrew already installed"
else
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> /Users/SFarthing/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
    echo "✅ Homebrew installed"
fi

if [ -d "$HOME/.asdf" ] 
then
    echo "✅ asdf installed"
else
    git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.10.0
fi

brew install direnv curl wget gpg

asdf plugin-add "yarn"
asdf plugin-add "nodejs"
asdf install
yarn install