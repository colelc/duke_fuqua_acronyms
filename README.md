# Fuqua Video Player

## Deployment

### Development

This project includes a Docker Compose file, so getting started is pretty easy. You need to paste in a few secrets as environment variables to the `vid-api` service in `docker-compose.yml`:

```yaml
vid-api:
  ....
  environment:
    GOOGLE_API_TOKEN: paste token
    VIMEO_API_KEY: paste key
    VIMEO_API_SECRET: paste long secret
    VIMEO_API_TOKEN: paste token
```

These are Google and Vimeo developer tokens for Fuqua accounts, so ___be careful to NOT commit to source control___. Afterwards, running on your machine is as easy as:

```bash
$ docker-compose up
```

This will mount your source code to the containers, so that you can edit files and not need to rebuild images. Angular changes are rebuilt immediately, but Python API changes require re-running the container.

### Production

At this point, GitLab builds the Docker images, but cannot deploy containers to Fuqua infrastructure. On Fuqua's Docker servers, you'll need to pull the images from the project's registry, and run the containers. When running, be sure to set secrets as environment variables, and create a network first.

#### Accessing OIT gitlab registry

You will need to create an access token within your [Duke gitlab account](https://gitlab.oit.duke.edu/-/user_settings/personal_access_tokens).



```bash
$ sudo docker login gitlab-registry.oit.duke.edu
$ sudo docker pull gitlab-registry.oit.duke.edu/fuqua-websites/video-player/api:master
$ sudo docker pull gitlab-registry.oit.duke.edu/fuqua-websites/video-player/client:master
$ sudo docker network create --driver bridge mmvideo
$ sudo docker run --detach --restart=always --network=mmvideo \
  -e "https_proxy=http://proxy.fuqua.duke.edu:3128" \
  -e "http_proxy=http://proxy.fuqua.duke.edu:3128" \
  -e "API_BASE=api" -e "DB_HOST={server}.fuqua.duke.edu" \
  -e "DB_NAME=mydb" -e "DB_USER=myuser" -e "DB_PASSWORD=password" \
  -e "GOOGLE_API_TOKEN=pastehere" -e "VIMEO_API_KEY=pastehere" \
  -e "VIMEO_API_SECRET=pastehere" -e "VIMEO_API_TOKEN=pastehere" \
  --name vid-api gitlab-registry.oit.duke.edu/fuqua-websites/video-player/api:master
$ sudo docker run --detach --restart=always --network=mmvideo -p 18080:80 \
  --name vid-client gitlab-registry.oit.duke.edu/fuqua-websites/video-player/client:master
```
