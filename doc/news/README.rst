Recording Changes
=================

Add a news fragment to ``doc/news/`` with each pull request that changes what
ships in LOVE-frontend. A fragment is a short reStructuredText file that
describes the change from an operator's perspective. Towncrier collects the
fragments into ``version_history.rst`` at release time.

Creating a fragment
-------------------

Name the file ``<JIRA-TICKET>.<TYPE>.rst``. Use the Rubin Jira ticket key so
Towncrier can link the release note to the ticket. Choose a type from this list.

* ``feature`` for a new feature.
* ``bugfix`` for a bug fix.
* ``perf`` for a performance improvement.
* ``doc`` for a documentation improvement.
* ``removal`` for a deprecation or removal.
* ``misc`` for other changes and additions.

From the repository root, run ``towncrier create`` and commit the generated
fragment with your pull request. For example:

.. code-block:: sh

   towncrier create SSW-12345.feature.rst

Use ``towncrier create +.feature.rst`` for an entry without a Jira ticket.
Use the ``skip-changelog`` label for pull requests that need no release note.

Previewing and building release notes
-------------------------------------

Run the following from the repository root to preview the pending entries.
Replace ``X.Y.Z`` with the intended release version, without the ``v`` prefix.

.. code-block:: sh

   towncrier build --version X.Y.Z --draft

For a release, update ``love/package.json`` and use that version to build the
changelog. This inserts the new entries and removes the consumed fragments.
Commit those changes together in the release pull request.

.. code-block:: sh

   version=$(node -p 'require("./love/package.json").version')
   towncrier build --version "$version" --yes

See `CONTRIBUTING.md <../../CONTRIBUTING.md>`__ for installation and tagging
instructions.
