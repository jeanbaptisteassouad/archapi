image_name = archapi
pwd = $(shell pwd)

all: devServer

devServer: dev
	sudo docker run \
		--network host \
		-p 8000:8000 \
		--mount type=bind,source=$(pwd),target=/mnt,readonly \
		-it \
		$(image_name)

dev: cleanContainer
	sudo docker build \
		--network host \
		--tag $(image_name) \
		.

cleanContainer:
	sudo docker container prune -f
