export default () => {
	const degrees = [
		{
			title: "Bachelor in Science (2018 - 2021)",
			desc: (
				<span className="text-sm font-normal">
					I earned my B.Sc in{" "}
					<b className="text-gray-600">Computer Science</b> from E.G.S
					Pillay Arts and Science College in Nagapattinam, TN, completing
					the program from 2018 to 2021 with a commendable{" "}
					<b className="text-gray-600">score of 79%</b>. This foundational
					degree provided me with essential knowledge and skills in
					computer science, laying the groundwork for my subsequent
					advanced studies and professional pursuits in the tech industry.
				</span>
			),
		},
		{
			title: "Master in Science (2021 - 2023)",
			desc: (
				<span className="text-sm font-normal">
					I hold an M.Sc in{" "}
					<b className="text-gray-600">Information Technology</b> from Sri
					Krishna Arts and Science College in Coimbatore, TN, completed
					between 2021 and 2023 with a distinguished{" "}
					<b className="text-gray-600">score of 84%</b>. This academic
					journey not only equipped me with a robust understanding of
					advanced IT concepts but also honed my skills in various
					cutting-edge technologies, preparing me to excel in the dynamic
					field of technology and software development.
				</span>
			),
		},
	];

	return (
		<div className="leading-relaxed mx-4 md:mx-8 pb-10 mt-20 pt-10 px-6">
			<div className="text-center space-y-3">
				<h1 className="block text-4xl font-bold text-primary">
					Educational Background
				</h1>
				<p className="text-gray-600 max-w-lg mx-auto">
					Showcasing the degrees and certifications that have shaped my
					professional foundation.
				</p>
			</div>
			<div
				className="relative bg-white rounded-md mt-10 md:max-w-3xl lg:max-w-4xl xl:max-w-5xl sm:mx-auto"
				style={{ boxShadow: "0px 7px 20px 7px #F1F1F1" }}>
				<div className="grid gap-4 py-8 md:grid-cols-2">
					{degrees.map((item, idx) => (
						<div
							className="space-y-3 mt-6 px-8"
							key={idx}>
							<h4 className="text-gray-800 text-xl font-bold text-primary ">
								{item.title}
							</h4>
							<p className="text-gray-500">{item.desc}</p>
						</div>
					))}
				</div>
				<span className="w-0.5 h-full bg-gray-200 m-auto absolute top-0 left-0 right-0 hidden md:block"></span>
			</div>
		</div>
	);
};
