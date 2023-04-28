---
title: Clone Remote Repository with SSH Key
published_at: 2023-04-28T08:17:42.000+07:00
excerpt: This is a simple trick to clone the private repository with a specific SSH key. The use case is to easier to deploy the project to the server machine...
image: /images/img-yxc6pGWXPYFoTxQZDBk3JRoP.png
language: en
reading_time: 1 min
tags:
  - Git
---

This is a simple trick to clone the private repository with a specific SSH key. The use case is to easier to deploy the project to the server machine.

### Generate Key Pair

```bash
ssh-keygen
```

Then, fill the passphrase or leave it blank. The key pair will be generated in `~/.ssh` directory.

### Add the Public Key to the Repository

Copy the public key to the repository. For example, Github. Go to `Repo > Settings > Deploy keys > Add deploy key`. Then, paste the public key.

### Clone the Repository

You need to use the generated private key to clone the repository. You can use the `GIT_SSH_COMMAND` environment variable to specify the private key.

```bash
GIT_SSH_COMMAND='ssh -i your_private_key -o IdentitiesOnly=yes' git clone your_repository.git && \
cd your_repository
```

And, you also need to set the `core.sshCommand` config to use the private key for all git commands.

```bash
git config core.sshCommand "ssh -i your_private_key"
```

Then, you can do `git pull` or `git push` without specifying the private key.

### Conclusion

That's it! Now, you can clone the repository with the specific SSH key. You can also use this trick to clone the repository in the server machine.