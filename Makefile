DASHBOARD_DIR := jaas-dashboard
DASHBOARD_DEPS := $(DASHBOARD_DIR)/node_modules
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

$(DASHBOARD_DEPS):
	git submodule update --init --remote --recursive
	git submodule sync --recursive
	cp config.local.js jaas-dashboard/public/config.local.js
	yarn install --cwd $(DASHBOARD_DIR)

$(MOCK_FILE): $(DASHBOARD_DEPS)
	yarn install
	yarn generate-mocks
