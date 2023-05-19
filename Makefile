DASHBOARD_DIR := jaas-dashboard
MOCK_FILE := mock-store.json

.PHONY: setup
setup: $(MOCK_FILE)
	echo "Setup done"

.PHONY: run
run:
	yarn start

.PHONY: clean
clean:
	-rm $(MOCK_FILE)
	-rm -r $(DASHBOARD_DIR)

$(DASHBOARD_DIR):
	git submodule update --init --recursive
	cp config.local.js jaas-dashboard/public/config.local.js
	yarn install --cwd $(DASHBOARD_DIR)

$(MOCK_FILE): $(DASHBOARD_DIR)
	yarn install
	yarn generate-mocks
