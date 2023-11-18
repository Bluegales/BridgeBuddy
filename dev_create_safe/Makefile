def:
	@echo - make deploy
	@echo - make transact

deploy:
	npx ts-node ./deploy_safe.ts

transact:
	npx ts-node ./transact.ts

addmodulegoer:
	npx ts-node ./add_module_goerli.ts

addmodulebase:
	npx ts-node ./add_module_base.ts

addmodulealfa:
	npx ts-node ./add_module_alfa.ts

addremote:
	cast send 0xe2d837A28FCc5BD57Bc642A7e2245dF86E366ae3 "addRemoteModule(uint32,address)" 84531 0x4E059b964778B945E4ae906880974487C907a4c6 --rpc-url https://eth-goerli.public.blastapi.io --private-key 648573ebfd6a7518a5a3fa9bd510ac27be0fd77deb95a348ba39cf0aca501093
	# npx ts-node ./add_remote.ts

bridge:
	npx ts-node ./bridgeexec.ts

checkenable:
	@echo goerli
	cast call 0xea49182d6557F8BD20Fe8c56955b337De404166C "isModuleEnabled(address)(bool)" 0xa8F241ea12F8b739b2CB8342B03D94D019aA7aAc --rpc-url https://eth-goerli.public.blastapi.io
	@echo base
	cast call 0x29bD8B2FCF7d0C215576f5dB4E7b065b45F0744d "isModuleEnabled(address)(bool)" 0x4E059b964778B945E4ae906880974487C907a4c6 --rpc-url https://base-goerli.publicnode.com
	
