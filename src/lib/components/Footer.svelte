<script>
	const year = new Date().getFullYear();
</script>

<footer class="site-footer">
	<div class="container">
		<div class="footer-content">
			<div class="footer-brand">
				<h3>Inspired By Math</h3>
				<p>Exploring the beauty of mathematics through interactive play.</p>
			</div>
			<div class="footer-links">
				<a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
				<a href="/mathfun/blog">Journal</a>
				<a href="/mathfun/simulations">Simulations</a>
			</div>
		</div>
		<div class="footer-bottom">
			<p>&copy; {year} Built with curiosity.</p>
		</div>
	</div>
</footer>

<style>
	.site-footer {
		background: var(--gray-100);
		border-top: 1px solid var(--gray-200);
		padding: 4rem 0 2rem;
		margin-top: auto;
	}

	:global([data-theme="dark"]) .site-footer {
		background: var(--gray-900);
		border-color: var(--gray-800);
	}

	.footer-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		margin-bottom: 3rem;
	}

	.footer-brand h3 {
		font-size: 1.25rem;
		margin-bottom: 0.5rem;
	}

	.footer-brand p {
		color: var(--gray-600);
		max-width: 300px;
	}

	:global([data-theme="dark"]) .footer-brand p {
		color: var(--gray-400);
	}

	.footer-links {
		display: flex;
		gap: 2rem;
		justify-content: flex-end;
	}

	.footer-links a {
		color: var(--gray-600);
		font-weight: 500;
		transition: color 0.2s;
	}

	:global([data-theme="dark"]) .footer-links a {
		color: var(--gray-400);
	}

	.footer-links a:hover {
		color: var(--indigo-600);
	}

	.footer-bottom {
		text-align: center;
		padding-top: 2rem;
		border-top: 1px solid var(--gray-200);
		color: var(--gray-500);
		font-size: 0.875rem;
	}

	:global([data-theme="dark"]) .footer-bottom {
		border-color: var(--gray-800);
		color: var(--gray-500);
	}

	@media (max-width: 640px) {
		.footer-content {
			grid-template-columns: 1fr;
			text-align: center;
		}

		.footer-links {
			justify-content: center;
		}

		.footer-brand p {
			margin: 0 auto;
		}
	}
</style>
